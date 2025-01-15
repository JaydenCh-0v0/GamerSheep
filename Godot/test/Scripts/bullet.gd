extends Area2D

@export var movement_speed: float = 200		# 飛行速度
@export var bullet_demage: int = 100		# 傷害力
@export var piercing: int = 0 				# 穿透力

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	await get_tree().create_timer(3).timeout
	queue_free()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _physics_process(delta: float) -> void:
	position += Vector2(movement_speed, 0)*delta

func _on_hit_enemy(area: Area2D) -> void:
	if area.is_in_group("enemy"):
		area.hurt(bullet_demage)
		piercing -= 1
	if piercing < 0: queue_free()
