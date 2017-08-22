# coding: utf-8

"""
    

    No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)

    OpenAPI spec version: 
    
    Generated by: https://github.com/swagger-api/swagger-codegen.git
"""


from pprint import pformat
from six import iteritems
import re


class V1APIVersions(object):
    """
    NOTE: This class is auto generated by the swagger code generator program.
    Do not edit the class manually.
    """
    def __init__(self, kind=None, api_version=None, versions=None, server_address_by_client_cid_rs=None):
        """
        V1APIVersions - a model defined in Swagger

        :param dict swaggerTypes: The key is attribute name
                                  and the value is attribute type.
        :param dict attributeMap: The key is attribute name
                                  and the value is json key in definition.
        """
        self.swagger_types = {
            'kind': 'str',
            'api_version': 'str',
            'versions': 'list[str]',
            'server_address_by_client_cid_rs': 'list[V1ServerAddressByClientCIDR]'
        }

        self.attribute_map = {
            'kind': 'kind',
            'api_version': 'apiVersion',
            'versions': 'versions',
            'server_address_by_client_cid_rs': 'serverAddressByClientCIDRs'
        }

        self._kind = kind
        self._api_version = api_version
        self._versions = versions
        self._server_address_by_client_cid_rs = server_address_by_client_cid_rs

    @property
    def kind(self):
        """
        Gets the kind of this V1APIVersions.
        Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds

        :return: The kind of this V1APIVersions.
        :rtype: str
        """
        return self._kind

    @kind.setter
    def kind(self, kind):
        """
        Sets the kind of this V1APIVersions.
        Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds

        :param kind: The kind of this V1APIVersions.
        :type: str
        """

        self._kind = kind

    @property
    def api_version(self):
        """
        Gets the api_version of this V1APIVersions.
        APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources

        :return: The api_version of this V1APIVersions.
        :rtype: str
        """
        return self._api_version

    @api_version.setter
    def api_version(self, api_version):
        """
        Sets the api_version of this V1APIVersions.
        APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources

        :param api_version: The api_version of this V1APIVersions.
        :type: str
        """

        self._api_version = api_version

    @property
    def versions(self):
        """
        Gets the versions of this V1APIVersions.
        versions are the api versions that are available.

        :return: The versions of this V1APIVersions.
        :rtype: list[str]
        """
        return self._versions

    @versions.setter
    def versions(self, versions):
        """
        Sets the versions of this V1APIVersions.
        versions are the api versions that are available.

        :param versions: The versions of this V1APIVersions.
        :type: list[str]
        """
        if versions is None:
            raise ValueError("Invalid value for `versions`, must not be `None`")

        self._versions = versions

    @property
    def server_address_by_client_cid_rs(self):
        """
        Gets the server_address_by_client_cid_rs of this V1APIVersions.
        a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.

        :return: The server_address_by_client_cid_rs of this V1APIVersions.
        :rtype: list[V1ServerAddressByClientCIDR]
        """
        return self._server_address_by_client_cid_rs

    @server_address_by_client_cid_rs.setter
    def server_address_by_client_cid_rs(self, server_address_by_client_cid_rs):
        """
        Sets the server_address_by_client_cid_rs of this V1APIVersions.
        a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.

        :param server_address_by_client_cid_rs: The server_address_by_client_cid_rs of this V1APIVersions.
        :type: list[V1ServerAddressByClientCIDR]
        """
        if server_address_by_client_cid_rs is None:
            raise ValueError("Invalid value for `server_address_by_client_cid_rs`, must not be `None`")

        self._server_address_by_client_cid_rs = server_address_by_client_cid_rs

    def to_dict(self):
        """
        Returns the model properties as a dict
        """
        result = {}

        for attr, _ in iteritems(self.swagger_types):
            value = getattr(self, attr)
            if isinstance(value, list):
                result[attr] = list(map(
                    lambda x: x.to_dict() if hasattr(x, "to_dict") else x,
                    value
                ))
            elif hasattr(value, "to_dict"):
                result[attr] = value.to_dict()
            elif isinstance(value, dict):
                result[attr] = dict(map(
                    lambda item: (item[0], item[1].to_dict())
                    if hasattr(item[1], "to_dict") else item,
                    value.items()
                ))
            else:
                result[attr] = value

        return result

    def to_str(self):
        """
        Returns the string representation of the model
        """
        return pformat(self.to_dict())

    def __repr__(self):
        """
        For `print` and `pprint`
        """
        return self.to_str()

    def __eq__(self, other):
        """
        Returns true if both objects are equal
        """
        if not isinstance(other, V1APIVersions):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """
        Returns true if both objects are not equal
        """
        return not self == other
