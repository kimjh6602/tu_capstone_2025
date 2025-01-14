# coding: utf-8
"""
BigGAN config.
"""

from __future__ import (absolute_import, division, print_function, unicode_literals)

import copy
import json

class BigGANConfig(object):
    """ Configuration class to store the configuration of a `BigGAN`. 
        Defaults are for the 128x128 model.
        layers tuple are (up-sample in the layer ?, input channels, output channels)
    """

    """
    BigGAN 기본 설정 값 초기화 (출력크기, 잠재 공간 차원, 
    임베딩 차원, 채널 폭, 클래스 개수, 레이어, 
    attention layer, 앱실론, 통계)
    """
    def __init__(self,
                 output_dim=128,
                 z_dim=128,
                 class_embed_dim=128,
                 channel_width=128,
                 num_classes=1000,
                 layers=[(False, 16, 16),
                         (True, 16, 16),
                         (False, 16, 16),
                         (True, 16, 8),
                         (False, 8, 8),
                         (True, 8, 4),
                         (False, 4, 4),
                         (True, 4, 2),
                         (False, 2, 2),
                         (True, 2, 1)],
                 attention_layer_position=8,
                 eps=1e-4,
                 n_stats=51):
        """ BigGANConfig 설계 """
        self.output_dim = output_dim
        self.z_dim = z_dim
        self.class_embed_dim = class_embed_dim
        self.channel_width = channel_width
        self.num_classes = num_classes
        self.layers = layers
        self.attention_layer_position = attention_layer_position
        self.eps = eps
        self.n_stats = n_stats

    @classmethod
    def from_dict(cls, json_object):
        """dictionary 매개변수로부터 BigGANconfig 객체 생성"""
        config = BigGANConfig()
        for key, value in json_object.items():
            config.__dict__[key] = value
        return config

    @classmethod
    def from_json_file(cls, json_file):
        """json 파일로부터 BigGANconfig 객체 생성"""
        with open(json_file, "r", encoding='utf-8') as reader:
            text = reader.read()
        return cls.from_dict(json.loads(text))

    def __repr__(self):
        return str(self.to_json_string())

    def to_dict(self):
        """객체를 dictionary로 직렬화(데이터를 딕셔너리로 포맷)"""
        output = copy.deepcopy(self.__dict__)
        return output

    def to_json_string(self):
        """json 문자열로 직렬화(데이터를 json 문자열로 포맷)"""
        return json.dumps(self.to_dict(), indent=2, sort_keys=True) + "\n"