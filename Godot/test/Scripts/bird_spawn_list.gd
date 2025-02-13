extends Sprite2D

class_name JD_Bird_Spawn_List

@export var bird_points: Array[JD_Bird_Spawn_Point] # true mean have bird, false mean no bird

func spwan_bird(bird_scene: PackedScene) -> bool:
	for bird_point in bird_points:
		if not bird_point.had_bird:
			bird_point.spawn_bird(bird_scene)
			return true
	return false # no space for spwan
