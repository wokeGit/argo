package commands

import (
	"fmt"
	"reflect"

	"github.com/argoproj/argo"
	wfv1 "github.com/argoproj/argo/api/workflow/v1alpha1"
	"github.com/argoproj/argo/errors"
	workflowclient "github.com/argoproj/argo/workflow/client"
	"github.com/argoproj/argo/workflow/common"
	"github.com/argoproj/argo/workflow/controller"
	"github.com/ghodss/yaml"
	goversion "github.com/hashicorp/go-version"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	appsv1beta2 "k8s.io/api/apps/v1beta2"
	apiv1 "k8s.io/api/core/v1"
	rbacv1beta1 "k8s.io/api/rbac/v1beta1"
	apiextensionsclient "k8s.io/apiextensions-apiserver/pkg/client/clientset/clientset"
	apierr "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes"
)

const clusterAdmin = "cluster-admin"

var (
	// These values may be overridden by the link flags during build
	// (e.g. imageTag will use the official release tag on tagged builds)
	imageNamespace = "argoproj"
	imageTag       = "latest"

	// These are the default image names which `argo install` uses during install
	DefaultControllerImage = imageNamespace + "/workflow-controller:" + imageTag
	DefaultExecutorImage   = imageNamespace + "/argoexec:" + imageTag
	DefaultUiImage         = imageNamespace + "/argoui:" + imageTag
)

func init() {
	RootCmd.AddCommand(installCmd)
	installCmd.Flags().StringVar(&installArgs.ControllerName, "controller-name", common.DefaultControllerDeploymentName, "name of controller deployment")
	installCmd.Flags().StringVar(&installArgs.InstanceID, "instanceid", "", "optional instance id to use for the controller (for multi-controller environments)")
	installCmd.Flags().StringVar(&installArgs.UIName, "ui-name", common.DefaultUiDeploymentName, "name of ui deployment")
	installCmd.Flags().StringVar(&installArgs.Namespace, "install-namespace", common.DefaultControllerNamespace, "install into a specific Namespace")
	installCmd.Flags().StringVar(&installArgs.ConfigMap, "configmap", common.DefaultConfigMapName(common.DefaultControllerDeploymentName), "install controller using preconfigured configmap")
	installCmd.Flags().StringVar(&installArgs.ControllerImage, "controller-image", DefaultControllerImage, "use a specified controller image")
	installCmd.Flags().StringVar(&installArgs.UIImage, "ui-image", DefaultUiImage, "use a specified ui image")
	installCmd.Flags().StringVar(&installArgs.ExecutorImage, "executor-image", DefaultExecutorImage, "use a specified executor image")
	installCmd.Flags().StringVar(&installArgs.ServiceAccount, "service-account", "", "use a specified service account for the workflow-controller deployment")
	installCmd.Flags().BoolVar(&installArgs.Upgrade, "upgrade", false, "upgrade controller/ui deployments and configmap if already installed")
}

// InstallFlags has all the required parameters for installing Argo.
type InstallFlags struct {
	ControllerName  string // --controller-name
	InstanceID      string // --instanceid
	UIName          string // --ui-name
	Namespace       string // --install-namespace
	ConfigMap       string // --configmap
	ControllerImage string // --controller-image
	UIImage         string // --ui-image
	ExecutorImage   string // --executor-image
	ServiceAccount  string // --service-account
	Upgrade         bool   // --upgrade
}

var installArgs InstallFlags

var installCmd = &cobra.Command{
	Use:   "install",
	Short: "install Argo",
	Run:   install,
}

// Install installs the Argo controller and UI in the given Namespace
func Install(cmd *cobra.Command, args InstallFlags) {
	fmt.Printf("Installing Argo %s into namespace '%s'\n", argo.GetVersion(), args.Namespace)
	clientset = initKubeClient()
	kubernetesVersionCheck(clientset)
	installCRD(clientset)
	if args.ServiceAccount == "" {
		if clusterAdminExists(clientset) {
			seviceAccountName := ArgoServiceAccount
			createServiceAccount(clientset, seviceAccountName, args)
			createClusterRoleBinding(clientset, seviceAccountName, args)
			args.ServiceAccount = seviceAccountName
		}
	}
	installConfigMap(clientset, args)
	if args.ServiceAccount == "" {
		fmt.Printf("Using default service account for deployments\n")
	} else {
		fmt.Printf("Using service account '%s' for deployments\n", args.ServiceAccount)
	}
	installController(clientset, args)
	installUI(clientset, args)
	installUIService(clientset, args)
}

func install(cmd *cobra.Command, args []string) {
	Install(cmd, installArgs)
}

func clusterAdminExists(clientset *kubernetes.Clientset) bool {
	clusterRoles := clientset.RbacV1beta1().ClusterRoles()
	_, err := clusterRoles.Get(clusterAdmin, metav1.GetOptions{})
	if err != nil {
		if apierr.IsNotFound(err) {
			return false
		}
		log.Fatalf("Failed to lookup 'cluster-admin' role: %v", err)
	}
	return true
}

func createServiceAccount(clientset *kubernetes.Clientset, serviceAccountName string, args InstallFlags) {
	serviceAccount := apiv1.ServiceAccount{
		TypeMeta: metav1.TypeMeta{
			APIVersion: "v1",
			Kind:       "ServiceAccount",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      serviceAccountName,
			Namespace: args.Namespace,
		},
	}
	_, err := clientset.CoreV1().ServiceAccounts(args.Namespace).Create(&serviceAccount)
	if err != nil {
		if !apierr.IsAlreadyExists(err) {
			log.Fatalf("Failed to create service account '%s': %v\n", serviceAccountName, err)
		}
		fmt.Printf("ServiceAccount '%s' already exists\n", serviceAccountName)
		return
	}
	fmt.Printf("ServiceAccount '%s' created\n", serviceAccountName)
}

func createClusterRoleBinding(clientset *kubernetes.Clientset, serviceAccountName string, args InstallFlags) {
	roleBinding := rbacv1beta1.ClusterRoleBinding{
		TypeMeta: metav1.TypeMeta{
			APIVersion: "rbac.authorization.k8s.io/v1beta1",
			Kind:       "ClusterRoleBinding",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: ArgoClusterRole,
		},
		RoleRef: rbacv1beta1.RoleRef{
			APIGroup: "rbac.authorization.k8s.io",
			Kind:     "ClusterRole",
			Name:     clusterAdmin,
		},
		Subjects: []rbacv1beta1.Subject{
			{
				Kind:      rbacv1beta1.ServiceAccountKind,
				Name:      serviceAccountName,
				Namespace: args.Namespace,
			},
		},
	}

	_, err := clientset.RbacV1beta1().ClusterRoleBindings().Create(&roleBinding)
	if err != nil {
		if !apierr.IsAlreadyExists(err) {
			log.Fatalf("Failed to create ClusterRoleBinding %s: %v\n", ArgoClusterRole, err)
		}
		fmt.Printf("ClusterRoleBinding '%s' already exists\n", ArgoClusterRole)
		return
	}
	fmt.Printf("ClusterRoleBinding '%s' created, bound '%s' to '%s'\n", ArgoClusterRole, serviceAccountName, clusterAdmin)
}

func kubernetesVersionCheck(clientset *kubernetes.Clientset) {
	// Check if the Kubernetes version is >= 1.8
	versionInfo, err := clientset.ServerVersion()
	if err != nil {
		log.Fatalf("Failed to get Kubernetes version: %v", err)
	}

	serverVersion, err := goversion.NewVersion(versionInfo.String())
	if err != nil {
		log.Fatalf("Failed to create version: %v", err)
	}

	minVersion, err := goversion.NewVersion("1.8")
	if err != nil {
		log.Fatalf("Failed to create minimum version: %v", err)
	}

	if serverVersion.LessThan(minVersion) {
		log.Fatalf("Server version %v < %v. Installation won't proceed...\n", serverVersion, minVersion)
	}

	fmt.Printf("Proceeding with Kubernetes version %v\n", serverVersion)
}

func installConfigMap(clientset *kubernetes.Clientset, args InstallFlags) {
	cmClient := clientset.CoreV1().ConfigMaps(args.Namespace)
	var wfConfig controller.WorkflowControllerConfig

	// install ConfigMap if non-existent
	wfConfigMap, err := cmClient.Get(args.ConfigMap, metav1.GetOptions{})
	if err != nil {
		if !apierr.IsNotFound(err) {
			log.Fatalf("Failed lookup of ConfigMap '%s' in namespace '%s': %v", args.ConfigMap, args.Namespace, err)
		}
		// Create the config map
		wfConfig.ExecutorImage = args.ExecutorImage
		wfConfig.InstanceID = args.InstanceID
		configBytes, err := yaml.Marshal(wfConfig)
		if err != nil {
			log.Fatalf("%+v", errors.InternalWrapError(err))
		}
		wfConfigMap.ObjectMeta.Name = args.ConfigMap
		wfConfigMap.Data = map[string]string{
			common.WorkflowControllerConfigMapKey: string(configBytes),
		}
		wfConfigMap, err = cmClient.Create(wfConfigMap)
		if err != nil {
			log.Fatalf("Failed to create ConfigMap '%s' in namespace '%s': %v", args.ConfigMap, args.Namespace, err)
		}
		fmt.Printf("ConfigMap '%s' created\n", args.ConfigMap)
	} else {
		// Check if existing configmap needs upgrade to a new executor image
		configStr, ok := wfConfigMap.Data[common.WorkflowControllerConfigMapKey]
		if !ok {
			log.Fatalf("ConfigMap '%s' missing key '%s'", args.ConfigMap, common.WorkflowControllerConfigMapKey)
		}
		err = yaml.Unmarshal([]byte(configStr), &wfConfig)
		if err != nil {
			log.Fatalf("Failed to load controller configuration: %v", err)
		}
		if wfConfig.ExecutorImage != args.ExecutorImage {
			if !args.Upgrade {
				log.Fatalf("ConfigMap '%s' requires upgrade. Rerun with --upgrade to update the configuration", args.ConfigMap)
			}
			wfConfig.ExecutorImage = args.ExecutorImage
			configBytes, err := yaml.Marshal(wfConfig)
			if err != nil {
				log.Fatalf("%+v", errors.InternalWrapError(err))
			}
			wfConfigMap.Data = map[string]string{
				common.WorkflowControllerConfigMapKey: string(configBytes),
			}
			_, err = cmClient.Update(wfConfigMap)
			if err != nil {
				log.Fatalf("Failed to update ConfigMap '%s' in namespace '%s': %v", args.ConfigMap, args.Namespace, err)
			}
			fmt.Printf("ConfigMap '%s' updated\n", args.ConfigMap)
		} else {
			fmt.Printf("Existing ConfigMap '%s' up-to-date\n", args.ConfigMap)
		}
	}
}

func installController(clientset *kubernetes.Clientset, args InstallFlags) {
	controllerDeployment := appsv1beta2.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: args.ControllerName,
		},
		Spec: appsv1beta2.DeploymentSpec{
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": args.ControllerName,
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app": args.ControllerName,
					},
				},
				Spec: apiv1.PodSpec{
					ServiceAccountName: args.ServiceAccount,
					Containers: []apiv1.Container{
						{
							Name:    args.ControllerName,
							Image:   args.ControllerImage,
							Command: []string{"workflow-controller"},
							Args:    []string{"--configmap", args.ConfigMap},
							Env: []apiv1.EnvVar{
								{
									Name: common.EnvVarNamespace,
									ValueFrom: &apiv1.EnvVarSource{
										FieldRef: &apiv1.ObjectFieldSelector{
											APIVersion: "v1",
											FieldPath:  "metadata.namespace",
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}
	createDeploymentHelper(&controllerDeployment, args)
}

func installUI(clientset *kubernetes.Clientset, args InstallFlags) {
	uiDeployment := appsv1beta2.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: args.UIName,
		},
		Spec: appsv1beta2.DeploymentSpec{
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": args.UIName,
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"app": args.UIName,
					},
				},
				Spec: apiv1.PodSpec{
					ServiceAccountName: args.ServiceAccount,
					Containers: []apiv1.Container{
						{
							Name:  args.UIName,
							Image: args.UIImage,
							Env: []apiv1.EnvVar{
								{
									Name: common.EnvVarNamespace,
									ValueFrom: &apiv1.EnvVarSource{
										FieldRef: &apiv1.ObjectFieldSelector{
											APIVersion: "v1",
											FieldPath:  "metadata.namespace",
										},
									},
								},
								{
									Name:  "IN_CLUSTER",
									Value: "true",
								},
							},
						},
					},
				},
			},
		},
	}
	createDeploymentHelper(&uiDeployment, args)
}

// createDeploymentHelper is helper to create or update an existing deployment (if --upgrade was supplied)
func createDeploymentHelper(deployment *appsv1beta2.Deployment, args InstallFlags) {
	depClient := clientset.AppsV1beta2().Deployments(args.Namespace)
	var result *appsv1beta2.Deployment
	var err error
	result, err = depClient.Create(deployment)
	if err != nil {
		if !apierr.IsAlreadyExists(err) {
			log.Fatal(err)
		}
		// deployment already exists
		existing, err := depClient.Get(deployment.ObjectMeta.Name, metav1.GetOptions{})
		if err != nil {
			log.Fatalf("Failed to get existing deployment: %v", err)
		}
		if upgradeNeeded(deployment, existing) {
			if !args.Upgrade {
				log.Fatalf("Deployment '%s' requires upgrade. Rerun with --upgrade to upgrade the deployment", deployment.ObjectMeta.Name)
			}
			existing, err = depClient.Update(deployment)
			if err != nil {
				log.Fatalf("Failed to update deployment: %v", err)
			}
			fmt.Printf("Existing deployment '%s' updated\n", existing.GetObjectMeta().GetName())
		} else {
			fmt.Printf("Existing deployment '%s' up-to-date\n", existing.GetObjectMeta().GetName())
		}
	} else {
		fmt.Printf("Deployment '%s' created\n", result.GetObjectMeta().GetName())
	}
}

// upgradeNeeded checks two deployments and returns whether or not there are obvious
// differences in a few deployment/container spec fields that would warrant an
// upgrade. WARNING: This is not intended to be comprehensive -- its primary purpose
// is to check if the controller/UI image is out of date with this version of argo.
func upgradeNeeded(dep1, dep2 *appsv1beta2.Deployment) bool {
	if len(dep1.Spec.Template.Spec.Containers) != len(dep2.Spec.Template.Spec.Containers) {
		return true
	}
	for i := 0; i < len(dep1.Spec.Template.Spec.Containers); i++ {
		ctr1 := dep1.Spec.Template.Spec.Containers[i]
		ctr2 := dep2.Spec.Template.Spec.Containers[i]
		if ctr1.Name != ctr2.Name {
			return true
		}
		if ctr1.Image != ctr2.Image {
			return true
		}
		if !reflect.DeepEqual(ctr1.Env, ctr2.Env) {
			return true
		}
		if !reflect.DeepEqual(ctr1.Command, ctr2.Command) {
			return true
		}
		if !reflect.DeepEqual(ctr1.Args, ctr2.Args) {
			return true
		}
	}
	return false
}

func installUIService(clientset *kubernetes.Clientset, args InstallFlags) {
	svcName := ArgoServiceName
	svcClient := clientset.CoreV1().Services(args.Namespace)
	uiSvc := apiv1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: svcName,
		},
		Spec: apiv1.ServiceSpec{
			Ports: []apiv1.ServicePort{
				{
					Port:       80,
					TargetPort: intstr.FromInt(8001),
				},
			},
			Selector: map[string]string{
				"app": args.UIName,
			},
		},
	}
	_, err := svcClient.Create(&uiSvc)
	if err != nil {
		if !apierr.IsAlreadyExists(err) {
			log.Fatal(err)
		}
		fmt.Printf("Service '%s' already exists\n", svcName)
	} else {
		fmt.Printf("Service '%s' created\n", svcName)
	}
}

func installCRD(clientset *kubernetes.Clientset) {
	apiextensionsclientset, err := apiextensionsclient.NewForConfig(restConfig)
	if err != nil {
		log.Fatalf("Failed to create CustomResourceDefinition '%s': %v", wfv1.CRDFullName, err)
	}

	// initialize custom resource using a CustomResourceDefinition if it does not exist
	result, err := workflowclient.CreateCustomResourceDefinition(apiextensionsclientset)
	if err != nil {
		if !apierr.IsAlreadyExists(err) {
			log.Fatalf("Failed to create CustomResourceDefinition: %v", err)
		}
		fmt.Printf("CustomResourceDefinition '%s' already exists\n", wfv1.CRDFullName)
	} else {
		fmt.Printf("CustomResourceDefinition '%s' created\n", result.GetObjectMeta().GetName())
	}
}
