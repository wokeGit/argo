package v1

import (
	"fmt"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

// CRD constants
const (
	CRDKind      string = "Workflow"
	CRDSingular  string = "workflow"
	CRDPlural    string = "workflows"
	CRDShortName string = "wf"
	CRDGroup     string = "argoproj.io"
	CRDVersion   string = "v1alpha1"
	CRDFullName  string = CRDPlural + "." + CRDGroup
)

// TemplateType is the type of a template
type TemplateType string

// Possible template types
const (
	TemplateTypeContainer TemplateType = "Container"
	TemplateTypeSteps     TemplateType = "Steps"
	TemplateTypeScript    TemplateType = "Script"
	TemplateTypeResource  TemplateType = "Resource"
)

// NodePhase is a label for the condition of a node at the current time.
type NodePhase string

// Workflow and node statuses
const (
	NodeRunning   NodePhase = "Running"
	NodeSucceeded NodePhase = "Succeeded"
	NodeSkipped   NodePhase = "Skipped"
	NodeFailed    NodePhase = "Failed"
	NodeError     NodePhase = "Error"
)

// Create a Rest client with the new CRD Schema
var SchemeGroupVersion = schema.GroupVersion{Group: CRDGroup, Version: CRDVersion}

// Workflow is the definition of our CRD Workflow class
type Workflow struct {
	metav1.TypeMeta   `json:",inline,squash"`
	metav1.ObjectMeta `json:"metadata"`
	Spec              WorkflowSpec   `json:"spec"`
	Status            WorkflowStatus `json:"status"`
}

type WorkflowList struct {
	metav1.TypeMeta `json:",inline,squash"`
	metav1.ListMeta `json:"metadata"`
	Items           []Workflow `json:"items"`
}

// WorkflowSpec is the specification of a Workflow.
type WorkflowSpec struct {
	// Templates is a list of workflow templates used in a workflow
	Templates []Template `json:"templates"`

	// Entrypoint is a template reference to the starting point of the workflow
	Entrypoint string `json:"entrypoint"`

	// Arguments contain the parameters and artifacts sent to the workflow entrypoint
	// Parameters are referencable globally using the 'workflow' variable prefix.
	// e.g. {{workflow.parameters.myparam}}
	Arguments Arguments `json:"arguments,omitempty"`

	// ServiceAccountName is the name of the ServiceAccount to run all pods of the workflow as.
	ServiceAccountName string `json:"serviceAccountName,omitempty"`

	// Volumes is a list of volumes that can be mounted by containers in a workflow.
	Volumes []apiv1.Volume `json:"volumes,omitempty"`

	// VolumeClaimTemplates is a list of claims that containers are allowed to reference.
	// The Workflow controller will create the claims at the beginning of the workflow
	// and delete the claims upon completion of the workflow
	VolumeClaimTemplates []apiv1.PersistentVolumeClaim `json:"volumeClaimTemplates,omitempty"`

	// NodeSelector is a selector which will result in all pods of the workflow
	// to be scheduled on the selected node(s). This is able to be overridden by
	// a nodeSelector specified in the template.
	NodeSelector map[string]string `json:"nodeSelector,omitempty"`

	// OnExit is a template reference which is invoked at the end of the
	// workflow, irrespective of the success, failure, or error of the
	// primary workflow.
	OnExit string `json:"onExit,omitempty"`
}

type Template struct {
	Name    string  `json:"name"`
	Inputs  Inputs  `json:"inputs,omitempty"`
	Outputs Outputs `json:"outputs,omitempty"`

	// NodeSelector is a selector to schedule this step of the workflow to be
	// run on the selected node(s). Overrides the selector set at the workflow level.
	NodeSelector map[string]string `json:"nodeSelector,omitempty"`

	// Deamon will allow a workflow to proceed to the next step so long as the container reaches readiness
	Daemon *bool `json:"daemon,omitempty"`

	// Workflow fields
	Steps [][]WorkflowStep `json:"steps,omitempty"`

	// Container
	Container *apiv1.Container `json:"container,omitempty"`

	// Script
	Script *Script `json:"script,omitempty"`

	// Sidecar containers
	Sidecars []Sidecar `json:"sidecars,omitempty"`

	Resource *ResourceTemplate `json:"resource,omitempty"`

	// Location in which all files related to the step will be stored (logs, artifacts, etc...).
	// Can be overridden by individual items in Outputs. If omitted, will use the default
	// artifact repository location configured in the controller, appended with the
	// <workflowname>/<nodename> in the key.
	ArchiveLocation *ArtifactLocation `json:"archiveLocation,omitempty"`

	// Optional duration in seconds relative to the StartTime that the pod may be active on a node
	// before the system actively tries to terminate the pod; value must be positive integer
	// This field is only applicable to container and script templates.
	ActiveDeadlineSeconds *int64 `json:"activeDeadlineSeconds,omitempty"`
}

// Inputs are the mechanism for passing parameters, artifacts, volumes from one template to another
type Inputs struct {
	Parameters []Parameter `json:"parameters,omitempty"`
	Artifacts  []Artifact  `json:"artifacts,omitempty"`
}

// Parameter indicate a passed string parameter to a service template with an optional default value
type Parameter struct {
	Name    string  `json:"name"`
	Value   *string `json:"value,omitempty"`
	Default *string `json:"default,omitempty"`

	// Path describes the location in which to retrieve the output parameter value from
	Path string `json:"path,omitempty"`
}

// Artifact indicates an artifact to place at a specified path
type Artifact struct {
	// name of the artifact. must be unique within a template's inputs/outputs.
	Name string `json:"name"`

	// Path is the container path to the artifact
	Path string `json:"path,omitempty"`

	// mode bits to use on this file, must be a value between 0 and 0777
	// set when loading input artifacts.
	Mode *int32 `json:"mode,omitempty"`

	// From allows an artifact to reference an artifact from a previous step
	From string `json:"from,omitempty"`

	ArtifactLocation `json:",inline,squash"`
}

// ArtifactLocation describes a location for a single or multiple artifacts.
// It is used as single artifact in the context of inputs/outputs (e.g. outputs.artifacts.artname).
// It is also used to describe the location of multiple artifacts such as the archive location
// of a single workflow step, which the executor will use as a default location to store its files.
type ArtifactLocation struct {
	S3   *S3Artifact   `json:"s3,omitempty"`
	Git  *GitArtifact  `json:"git,omitempty"`
	HTTP *HTTPArtifact `json:"http,omitempty"`
}

type Outputs struct {
	// Parameters holds the list of output parameters produced by a step
	Parameters []Parameter `json:"parameters,omitempty"`

	// Artifacts holds the list of output artifacts produced by a step
	Artifacts []Artifact `json:"artifacts,omitempty"`

	// Result holds the result (stdout) of a script template
	Result *string `json:"result,omitempty"`
}

// WorkflowStep is a template ref
type WorkflowStep struct {
	Name      string    `json:"name,omitempty"`
	Template  string    `json:"template,omitempty"`
	Arguments Arguments `json:"arguments,omitempty"`
	WithItems []Item    `json:"withItems,omitempty"`
	WithParam string    `json:"withParam,omitempty"`
	When      string    `json:"when,omitempty"`
}

// Item expands a single workflow step into multiple parallel steps
type Item interface{}

// Arguments to a template
type Arguments struct {
	Parameters []Parameter `json:"parameters,omitempty"`
	Artifacts  []Artifact  `json:"artifacts,omitempty"`
}

// Sidecar is a container which runs alongside the main container
type Sidecar struct {
	apiv1.Container `json:",inline,squash"`

	SidecarOptions `json:",inline,squash"`
}

// SidecarOptions provide a way to customize the behavior of a sidecar and how it
// affects the main container.
type SidecarOptions struct {

	// MirrorVolumeMounts will mount the same volumes specified in the main container
	// to the sidecar (including artifacts), at the same mountPaths. This enables
	// dind daemon to partially see the same filesystem as the main container in
	// order to use features such as docker volume binding
	MirrorVolumeMounts *bool `json:"mirrorVolumeMounts,omitempty"`

	// Other sidecar options to consider:
	// * Lifespan - allow a sidecar to live longer than the main container and run to completion.
	// * PropogateFailure - if a sidecar fails, also fail the step
}

type WorkflowStatus struct {
	// Phase a simple, high-level summary of where the workflow is in its lifecycle.
	Phase NodePhase `json:"phase"`

	// Time at which this workflow started
	StartedAt metav1.Time `json:"startedAt,omitempty"`

	// Time at which this workflow completed
	FinishedAt metav1.Time `json:"finishedAt,omitempty"`

	// A human readable message indicating details about why the workflow is in this condition.
	Message string `json:"message,omitempty"`

	// Nodes is a mapping between a node ID and the node's status.
	Nodes map[string]NodeStatus `json:"nodes"`

	// PersistentVolumeClaims tracks all PVCs that were created as part of the workflow.
	// The contents of this list are drained at the end of the workflow.
	PersistentVolumeClaims []apiv1.Volume `json:"persistentVolumeClaims,omitempty"`
}

type NodeStatus struct {
	// ID is a unique identifier of a node within the worklow
	// It is implemented as a hash of the node name, which makes the ID deterministic
	ID string `json:"id"`

	// Name is a human readable representation of the node in the node tree
	// It can represent a container, step group, or the entire workflow
	Name string `json:"name"`

	// Phase a simple, high-level summary of where the node is in its lifecycle.
	// Can be used as a state machine.
	Phase NodePhase `json:"phase"`

	// A human readable message indicating details about why the node is in this condition.
	Message string `json:"message,omitempty"`

	// Time at which this node started
	StartedAt metav1.Time `json:"startedAt,omitempty"`

	// Time at which this node completed
	FinishedAt metav1.Time `json:"finishedAt,omitempty"`

	// PodIP captures the IP of the pod for daemoned steps
	PodIP string `json:"podIP,omitempty"`

	// Daemoned tracks whether or not this node was daemoned and need to be terminated
	Daemoned *bool `json:"daemoned,omitempty"`

	// Outputs captures output parameter values and artifact locations
	Outputs *Outputs `json:"outputs,omitempty"`

	// Children is a list of child node IDs
	Children []string `json:"children,omitempty"`
}

func (n NodeStatus) String() string {
	return fmt.Sprintf("%s (%s)", n.Name, n.ID)
}

// Completed returns whether or not the node has completed execution
func (n NodeStatus) Completed() bool {
	return n.Phase == NodeSucceeded ||
		n.Phase == NodeFailed ||
		n.Phase == NodeError ||
		n.Phase == NodeSkipped
}

// IsDaemoned returns whether or not the node is deamoned
func (n NodeStatus) IsDaemoned() bool {
	if n.Daemoned == nil || !*n.Daemoned {
		return false
	}
	return true
}

// Successful returns whether or not this node completed successfully
func (n NodeStatus) Successful() bool {
	return n.Phase == NodeSucceeded || n.Phase == NodeSkipped
}

type S3Bucket struct {
	Endpoint        string                  `json:"endpoint"`
	Bucket          string                  `json:"bucket"`
	Region          string                  `json:"region,omitempty"`
	Insecure        *bool                   `json:"insecure,omitempty"`
	AccessKeySecret apiv1.SecretKeySelector `json:"accessKeySecret"`
	SecretKeySecret apiv1.SecretKeySelector `json:"secretKeySecret"`
}

type S3Artifact struct {
	S3Bucket `json:",inline,squash"`
	Key      string `json:"key"`
}

type GitArtifact struct {
	Repo           string                   `json:"repo"`
	Revision       string                   `json:"revision,omitempty"`
	UsernameSecret *apiv1.SecretKeySelector `json:"usernameSecret,omitempty"`
	PasswordSecret *apiv1.SecretKeySelector `json:"passwordSecret,omitempty"`
}

type HTTPArtifact struct {
	URL string `json:"url"`
}

// Script is a template subtype to enable scripting through code steps
type Script struct {
	Image   string   `json:"image"`
	Command []string `json:"command"`
	Source  string   `json:"source"`
}

// ResourceTemplate is a template subtype to manipulate kubernetes resources
type ResourceTemplate struct {
	// Action is the action to perform to the resource.
	// Must be one of: create, apply, delete
	Action string `json:"action"`

	// Manifest contains the kubernetes manifest
	Manifest string `json:"manifest"`

	// SuccessCondition is a label selector expression which describes the conditions
	// of the k8s resource in which it is acceptable to proceed to the following step
	SuccessCondition string `json:"successCondition,omitempty"`

	// FailureCondition is a label selector expression which describes the conditions
	// of the k8s resource in which the step was considered failed
	FailureCondition string `json:"failureCondition,omitempty"`
}

func (tmpl *Template) GetType() TemplateType {
	if tmpl.Container != nil {
		return TemplateTypeContainer
	}
	if tmpl.Steps != nil {
		return TemplateTypeSteps
	}
	if tmpl.Script != nil {
		return TemplateTypeScript
	}
	if tmpl.Resource != nil {
		return TemplateTypeResource
	}
	return "Unknown"
}

func (in *Inputs) GetArtifactByName(name string) *Artifact {
	for _, art := range in.Artifacts {
		if art.Name == name {
			return &art
		}
	}
	return nil
}

func (in *Inputs) GetParameterByName(name string) *Parameter {
	for _, param := range in.Parameters {
		if param.Name == name {
			return &param
		}
	}
	return nil
}

func (out *Outputs) HasOutputs() bool {
	if out.Result != nil {
		return true
	}
	if len(out.Artifacts) > 0 {
		return true
	}
	if len(out.Parameters) > 0 {
		return true
	}
	return false
}

func (args *Arguments) GetArtifactByName(name string) *Artifact {
	for _, art := range args.Artifacts {
		if art.Name == name {
			return &art
		}
	}
	return nil
}

func (args *Arguments) GetParameterByName(name string) *Parameter {
	for _, param := range args.Parameters {
		if param.Name == name {
			return &param
		}
	}
	return nil
}

// HasLocation whether or not an artifact has a location defined
func (a *Artifact) HasLocation() bool {
	return a.S3 != nil || a.Git != nil || a.HTTP != nil
}
