extends SkillTemplate
class_name Skill_BulletShooter

@export var bullet_scene: PackedScene

func act():
	var bullet_node = bullet_scene.instantiate()
	bullet_node.position = position + Vector2(6,0)
	get_tree().current_scene.add_child(bullet_node)
