extends Node2D

@onready var tile_map = $TileMap
var layer = ["water","ground","sand","cliffs","environment"]
var can_place_seed_custom_data = "can_place_seed"

enum GAME_MODE {NORMAL, BUILD, FARME, FIGHT}
var game_mode: GAME_MODE = GAME_MODE.NORMAL
var dirt_tiles=[]

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _input(event):
	if (Input.is_action_just_pressed("ui_cancel")):
		get_tree().quit()
	if (Input.is_action_just_pressed("click")):
		#print("click")
		var mouse_pos = get_global_mouse_position()
		var tile_mouse_pos = tile_map.local_to_map(mouse_pos)
		match(game_mode):
			GAME_MODE.NORMAL:
				print("GAME_MODE.NORMAL")
			GAME_MODE.BUILD:
				print("GAME_MODE.BUILD")
				if retrieving_custom_data(tile_mouse_pos, "ground", "can_place_dirt"):
					dirt_tiles.append(tile_mouse_pos)
					tile_map.set_cells_terrain_connect(layer.find("sand"), dirt_tiles, 1, 0)
				else: 
					print("faile to place dirt")
				
			GAME_MODE.FARME:
				print("GAME_MODE.FARME")
				var source_id = 5
				var atlas_coord = Vector2i (1,0)
				if retrieving_custom_data(tile_mouse_pos, "sand", "can_place_seed"):
					tile_map.set_cell(layer.find("environment"), tile_mouse_pos, source_id, atlas_coord)
					handle_seed(tile_mouse_pos, 0, atlas_coord, 3)
				else: 
					print("faile to place seed")

			GAME_MODE.FIGHT:
				print("GAME_MODE.FIGHT")
				
	if (Input.is_action_just_released("swap_item_prev")):
		change_game_mode(-1)
	if (Input.is_action_just_released("swap_item_next")):
		change_game_mode(+1)

func retrieving_custom_data(tile_pos, layer_name, custom_data_name):
	var tile_data: TileData = tile_map.get_cell_tile_data(layer.find(layer_name), tile_pos)
	if (tile_data):
		return tile_data.get_custom_data(custom_data_name)
	else: return false

func change_game_mode(num:int):
	game_mode+=num
	if game_mode >= GAME_MODE.size():
		game_mode = 0
	if game_mode < 0:
		game_mode = GAME_MODE.size() + game_mode
	print(game_mode)

func handle_seed(tile_pos, seed_level, atlas_coord, seed_level_max):
	tile_map.set_cell(layer.find("environment"), tile_pos, 5, atlas_coord)
	
	await get_tree().create_timer(5.0).timeout
	if seed_level == seed_level_max:
		return
	else:
		var new_atlas : Vector2i = Vector2i(atlas_coord.x+1, atlas_coord.y)
		handle_seed(tile_pos, seed_level+1, new_atlas, seed_level_max)
	
