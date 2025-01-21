extends Area2D

class_name JD_Bullet

enum BULLET_TYPE {
	Normal,
	Fire,
	Ice
}

@export var bullet_body: AnimatedSprite2D	#
@export var bullet_effect: AnimatedSprite2D # 
@export var atteck_cooldown: int = 3		# 攻擊間隔 (sec)
@export var movement_speed: float = 200		# 飛行速度 (pix/sec)
@export var bullet_demage: int = 100		# 傷害力
@export var piercing: int = 0 				# 穿透力
@export var type: BULLET_TYPE

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	add_to_group("bullet")
	
	bullet_body.play("Create")
	bullet_effect.visible = false
	await get_tree().create_timer(atteck_cooldown-0.5).timeout
	QFree(0.5)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _physics_process(delta: float) -> void:
	position += Vector2(movement_speed, 0)*delta

func QFree(sec: float) -> void:
	bullet_body.play("Die")
	create_tween().tween_property(self, "modulate", Color(Color.WHITE,0), sec)
	await get_tree().create_timer(sec).timeout
	queue_free()

func _on_hit_enemy(area: Area2D) -> void:
	if area.is_in_group("enemy"):
		area.hurt(bullet_demage)
		piercing -= 1
	
	if type == BULLET_TYPE.Normal and area.is_in_group("bullet"):
		if area.type == BULLET_TYPE.Fire:
			bullet_effect.visible = true
			bullet_effect.play("Fire")
			bullet_demage += 10
			type = BULLET_TYPE.Fire
	
	if piercing < 0: 
		QFree(0)



func _on_bullet_body_animation_finished() -> void:
	bullet_body.play("OnShoot")
