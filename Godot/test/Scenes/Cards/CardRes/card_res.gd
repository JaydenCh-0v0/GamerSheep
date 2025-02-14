extends Resource

class_name cardRes

@export var sun_num 	: int = 25 				#阳光消耗
@export var cool_time  	: float = 2.0			#冷却时间
@export var card_light 	: Texture2D
@export var card_dark  	: Texture2D
@export var max_health 	: int = 100				#植物生命
@export var card_shadow	: Texture2D
#@export var card_type:CardTypeManager.CARD_TYPE

@export var bird_scene:PackedScene
