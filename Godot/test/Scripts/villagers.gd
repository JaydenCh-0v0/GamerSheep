extends Area2D

class_name JD_Villager

enum Personalities {
	Cranky,		#暴躁
	Jock,		#運動
	Lazy,		#悠閒
	Normal,		#平常
	Peppy,		#活潑
	Sisterly,	#大姐姐<3
	Smug,		#自戀
	Snooty,		#成熟
}

enum Species {
	Fox
}

enum Hobbies {
	Education,	# 教育
	Fashion,	# 時尚
	Fitness,	# 健康
	Music,		# 音樂
	Nature,		# 自然
	Play,		# 玩樂
}

@export var villager_name: String
@export var personality: Personalities
@export var specy: Species 
@export var hobby: Hobbies 
@export var catchphrase: String # 口頭禪
@export var birthday: float # 1月23日 --> .23

var chat_recap: String

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
