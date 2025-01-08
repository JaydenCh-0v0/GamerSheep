extends CharacterBody2D

@export var player_speed: float = 100.0
@export var player_animation_sprite: AnimatedSprite2D

@export var bullet_scene: PackedScene

var is_gameover: bool = false

# inter func

func _ready() -> void:
	add_to_group("friend")

func _physics_process(delta: float) -> void:
	# print(delta)
	if (not is_gameover): 
		update_player_movement()
		update_player_animation()

#  player func

func update_player_movement() -> void:
	#Control
	velocity = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down") * player_speed
	move_and_slide()

func update_player_animation() -> void:
	if velocity.is_zero_approx():
		player_animation_sprite.play("idel")
	else:
		player_animation_sprite.play("run")

func gameover():
	is_gameover = true
	player_animation_sprite.play("die")
	await get_tree().create_timer(3).timeout
	get_tree().reload_current_scene()


func _on_fire() -> void:
	if is_gameover or velocity != Vector2.ZERO:
		return
	
	var bullet_node = bullet_scene.instantiate()
	bullet_node.position = position + Vector2(6,0)
	get_tree().current_scene.add_child(bullet_node)
