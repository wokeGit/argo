# coding: utf-8

"""
    

    No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)

    OpenAPI spec version: 
    
    Generated by: https://github.com/swagger-api/swagger-codegen.git
"""


from pprint import pformat
from six import iteritems
import re


class V1DownwardAPIVolumeSource(object):
    """
    NOTE: This class is auto generated by the swagger code generator program.
    Do not edit the class manually.
    """
    def __init__(self, items=None, default_mode=None):
        """
        V1DownwardAPIVolumeSource - a model defined in Swagger

        :param dict swaggerTypes: The key is attribute name
                                  and the value is attribute type.
        :param dict attributeMap: The key is attribute name
                                  and the value is json key in definition.
        """
        self.swagger_types = {
            'items': 'list[V1DownwardAPIVolumeFile]',
            'default_mode': 'int'
        }

        self.attribute_map = {
            'items': 'items',
            'default_mode': 'defaultMode'
        }

        self._items = items
        self._default_mode = default_mode

    @property
    def items(self):
        """
        Gets the items of this V1DownwardAPIVolumeSource.
        Items is a list of downward API volume file

        :return: The items of this V1DownwardAPIVolumeSource.
        :rtype: list[V1DownwardAPIVolumeFile]
        """
        return self._items

    @items.setter
    def items(self, items):
        """
        Sets the items of this V1DownwardAPIVolumeSource.
        Items is a list of downward API volume file

        :param items: The items of this V1DownwardAPIVolumeSource.
        :type: list[V1DownwardAPIVolumeFile]
        """

        self._items = items

    @property
    def default_mode(self):
        """
        Gets the default_mode of this V1DownwardAPIVolumeSource.
        Optional: mode bits to use on created files by default. Must be a value between 0 and 0777. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

        :return: The default_mode of this V1DownwardAPIVolumeSource.
        :rtype: int
        """
        return self._default_mode

    @default_mode.setter
    def default_mode(self, default_mode):
        """
        Sets the default_mode of this V1DownwardAPIVolumeSource.
        Optional: mode bits to use on created files by default. Must be a value between 0 and 0777. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

        :param default_mode: The default_mode of this V1DownwardAPIVolumeSource.
        :type: int
        """

        self._default_mode = default_mode

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
        if not isinstance(other, V1DownwardAPIVolumeSource):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """
        Returns true if both objects are not equal
        """
        return not self == other
