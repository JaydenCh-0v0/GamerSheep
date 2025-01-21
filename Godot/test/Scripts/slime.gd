extends Area2D

@export var movement_speed: float = 100.0
@export var slime_animation_sprite: AnimatedSprite2D

var HP: int = 100

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	add_to_group("enemy")
	slime_animation_sprite.speed_scale += randf_range(-0.1, 0.1)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _physics_process(delta: float) -> void:
	position += Vector2(-movement_speed, 0) * delta
	if position.x < -260:
		queue_free()

func hurt(demage: int):
	HP -= demage
	if HP <= 0: die()
	else: play_hurt()

func die():
	slime_animation_sprite.play("die")
	movement_speed = 0
	get_tree().current_scene.score += 1
	remove_from_group("enemy")
	await get_tree().create_timer(0.6).timeout
	queue_free()

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D and HP>0:
		body.gameover()

func play_hurt() -> void:
	var temp = modulate
	modulate = Color.PALE_VIOLET_RED
	await get_tree().create_timer(0.1).timeout
	modulate = temp
