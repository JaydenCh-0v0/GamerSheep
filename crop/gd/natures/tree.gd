extends StaticBody2D

@onready var hitable_component: HitableComponent = $HitableComponent
@onready var damage_component: DamageComponent = $DamageComponent
@onready var sprite_2d: Sprite2D = $Sprite2D

var log_scene = preload("res://tscn/Collectables/log.tscn")

func _ready() -> void:
	hitable_component.hitable_activated.connect(on_hitable_activated)
	hitable_component.hitable_deactivated.connect(on_hitable_deactivated)
	damage_component.max_damage_reached.connect(on_max_damage_reached)

func on_hitable_activated(hit_damage:int) -> void:
	damage_component.apply_damage(hit_damage)
	sprite_2d.material.set_shader_parameter("shake_intensity", 2.0)
	sprite_2d.material.set_shader_parameter("shake_speed", 10.0)
#	Fuck it should be use tween get better shake animation
#	But it got fast speed of shaking, waiting for fix it 
	await get_tree().create_timer(1).timeout
	sprite_2d.material.set_shader_parameter("shake_intensity", 1.0)
	sprite_2d.material.set_shader_parameter("shake_speed", 5.0)
	print("on_hitable_activated")

func on_hitable_deactivated() -> void:
	print("on_hitable_deactivated")

func on_max_damage_reached() -> void:
	call_deferred("add_log_scene")
	print("on_max_damage_reached")
	queue_free()

func add_log_scene() -> void:
	var log = log_scene.instantiate() as Node2D
	get_parent().add_child(log)
	log.global_position = global_position
