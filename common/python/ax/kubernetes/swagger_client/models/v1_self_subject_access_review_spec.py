# coding: utf-8

"""
    

    No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)

    OpenAPI spec version: 
    
    Generated by: https://github.com/swagger-api/swagger-codegen.git
"""


from pprint import pformat
from six import iteritems
import re


class V1SelfSubjectAccessReviewSpec(object):
    """
    NOTE: This class is auto generated by the swagger code generator program.
    Do not edit the class manually.
    """
    def __init__(self, resource_attributes=None, non_resource_attributes=None):
        """
        V1SelfSubjectAccessReviewSpec - a model defined in Swagger

        :param dict swaggerTypes: The key is attribute name
                                  and the value is attribute type.
        :param dict attributeMap: The key is attribute name
                                  and the value is json key in definition.
        """
        self.swagger_types = {
            'resource_attributes': 'V1ResourceAttributes',
            'non_resource_attributes': 'V1NonResourceAttributes'
        }

        self.attribute_map = {
            'resource_attributes': 'resourceAttributes',
            'non_resource_attributes': 'nonResourceAttributes'
        }

        self._resource_attributes = resource_attributes
        self._non_resource_attributes = non_resource_attributes

    @property
    def resource_attributes(self):
        """
        Gets the resource_attributes of this V1SelfSubjectAccessReviewSpec.
        ResourceAuthorizationAttributes describes information for a resource access request

        :return: The resource_attributes of this V1SelfSubjectAccessReviewSpec.
        :rtype: V1ResourceAttributes
        """
        return self._resource_attributes

    @resource_attributes.setter
    def resource_attributes(self, resource_attributes):
        """
        Sets the resource_attributes of this V1SelfSubjectAccessReviewSpec.
        ResourceAuthorizationAttributes describes information for a resource access request

        :param resource_attributes: The resource_attributes of this V1SelfSubjectAccessReviewSpec.
        :type: V1ResourceAttributes
        """

        self._resource_attributes = resource_attributes

    @property
    def non_resource_attributes(self):
        """
        Gets the non_resource_attributes of this V1SelfSubjectAccessReviewSpec.
        NonResourceAttributes describes information for a non-resource access request

        :return: The non_resource_attributes of this V1SelfSubjectAccessReviewSpec.
        :rtype: V1NonResourceAttributes
        """
        return self._non_resource_attributes

    @non_resource_attributes.setter
    def non_resource_attributes(self, non_resource_attributes):
        """
        Sets the non_resource_attributes of this V1SelfSubjectAccessReviewSpec.
        NonResourceAttributes describes information for a non-resource access request

        :param non_resource_attributes: The non_resource_attributes of this V1SelfSubjectAccessReviewSpec.
        :type: V1NonResourceAttributes
        """

        self._non_resource_attributes = non_resource_attributes

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
        if not isinstance(other, V1SelfSubjectAccessReviewSpec):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """
        Returns true if both objects are not equal
        """
        return not self == other
