/**************************************
TEB's Forum Emblem Editor
Please do not copy/use this code outside of the
Emblem Brigade Forums without Cedar's explicit permission.
Thanks!
***************************************/

 /*****Special Thanks To*********************
 - Vansalon for requesting this tool
- Aura for reminding me of its existance
- Everyone from the Emblem Brigade for their support and being awesome
 *******************************************/

/******* TODO LIST *****************************
 In General (Reminder notes to self)
 * Clean up code
 * Use external css instead of spamming the html style attribute
 * Comment stuff (search for "COMMENTS UNFINISHED BELOW THIS LINE" to continue commenting, yay)
 
 
 
 ********************************************/

// JQuery code to make textboxes draggable
$(function() {
 $("#SmallTextboxImg").draggable({containment:"#textboxPosImagesDiv"});
 $("#MediumTextboxImg").draggable({containment:"#textboxPosImagesDiv"});
 $("#LargeTextboxImg").draggable({containment:"#textboxPosImagesDiv"});
 });
 
$(function() {
	$( "#char_accordion" ).accordion({
	heightStyle: "content",
	collapsible: true
	});
});

// Called when page is loaded/refreshed
function setUp()
{
	updateSelectOptions('.weaponRank',weaponRanks);
	document.unitEditorForm.btn_addUnit.disabled = "";
	// get info from iframe
	//getDefinitions();
}

/*Used to format definition lists obtained from other sources
  (Not really used in this tool, just for generating the lists)*/
function getNicelyFormattedList(list)
{
	var retVal = "";
	for(var i = 0; i < list.length; i++)
	{
		var name = list[i].replace(/ /g,"");
		retVal += "\"" + name + "\",\n";
	}
	alert(retVal);
}

// Adds temporay and permanent event ids 0x05 - 0xC3
// Also adds condition ids
function getAvailableEventIds()
{
	var eventIds = [];
	var conditionIds = ["0x01","0x02","0x03","0x04"];
	var id = "";
	for(var i = 5; i < 100; i++)
	{
		var integer = i.toString(16);
		if(integer != "43")
		{
			id = "0x" + integer;
			eventIds.push(id);
			conditionIds.push(id);
		}
	}
	updateSelectOptions(".AvailableEventIds", eventIds);
	updateSelectOptions(".AvailableCondIds", conditionIds);
	var permEventIds = [];
	for(var j = 102; j < 195; j++)
	{
		var integer = j.toString(16);
		if(integer != "9c")
			permEventIds.push("0x" + integer);
	}
	updateSelectOptions(".AvailablePermEventIds",permEventIds);
}

// Resets map pointers and click positions back to (0,0)
function resetMapPointerLoc()
{
	$(".MapClickPos").each(function()
	{
		this.value = 0;
	});
	
	document.getElementById("StartPointer").style.left = "0px";
	document.getElementById("StartPointer").style.top = "0px";
}

/* Sets what map clicks do:
 * Add - Sets the click position to the start/load position of a new unit.
 * Edit - Allows user to edit a clicked unit
 * Delete - Deletes the clicked unit
 */
function setMapClickMode()
{
	var mode = getSelectedOption(document.topForm.sel_mapClickMode);
	if(mode == "Add")
	{
		document.unitEditorForm.btn_editUnit.disabled = "disabled";
		document.unitEditorForm.txt_unitNum.value = "";
		document.getElementById("unitNum").style.display = "none";
		document.unitEditorForm.btn_addUnit.disabled = "";
		// Sets back to generic map sprite
		document.unitEditorForm.rd_genericSprite.checked = "checked";
		document.unitEditorForm.rd_characterSprite.checked = "";
		document.unitEditorForm.rd_customSprite.checked = "";
		document.unitEditorForm.customMapSpriteImage.value = "";
	}
	else if(mode == "Edit")
	{
		document.unitEditorForm.btn_addUnit.disabled = "disabled";
		document.getElementById("unitNum").style.display = "inline";
	}
	else
	{
		document.unitEditorForm.btn_addUnit.disabled = "disabled";
		document.unitEditorForm.btn_editUnit.disabled = "disabled";
		document.getElementById("unitNum").style.display = "none";
	}
}	

// Gets rid of all selectable options (for characters, classes, and items) in the Unit Editor form
function clearAllOptions()
{
	document.getElementById("sel_character").innerHTML = "";
	document.getElementById("sel_class").innerHTML = "";
	document.getElementById("sel_leadChar").innerHTML = "";
	document.getElementById("sel_item1").innerHTML = "";
	document.getElementById("sel_item2").innerHTML = "";
	document.getElementById("sel_item3").innerHTML = "";
	document.getElementById("sel_item4").innerHTML = "";
}

/* Updates the options for the specified selection combo box
 *
 * Parameters:
 * string select - selection combo box id
 * Array array - the array containing all the new options to be added to the combo box
 */
function updateSelectOptions(select,array)
{
	$(select).each(function()
	{
		$(this).empty();
		for(key in array)
			$(this).append(optionOpen + array[key] + optionClosed);
	});
}

/* Sets the status of the specified option to selected for any given combo box
 *
 * Parameters:
 * string option - Option that should be selected
 * element select - the select combo box that contains the specified option
 *
 * Returns true if successful
 */
function setSelectedOption(option, select)
{
	var currentOption;
	for(var i = 0; i < select.options.length; i++)
	{
		currentOption = select.options[i];
		if(currentOption.value == option)
		{
			currentOption.selected = "selected";
			return true;
		}
	}
	alert("Error: " + option + " is not an available selection.");
	return false;
}

function setSelectedOptionByMatch(option, select)
{
	var currentOption;
	for(var i = 0; i < select.options.length; i++)
	{
		currentOption = select.options[i];
		var listedItem = currentOption.value;
		if(listedItem.match(option) != null)
		{
			currentOption.selected = "selected";
			return true;
		}
	}
	alert("Error: " + option + " is not an available selection.");
	return false;
}


/* Sets a unit block as the selected unit block
 *
 * Parameter:
 * int num - Id of the unit block to be selected
 *
 * Returns true if successful
 */
function setSelectedBlock(num)
{
	var currentOption, blockId;
	var select = document.topForm.sel_unitBlock;
	for(var i = 0; i < select.options.length; i++)
	{
		currentOption = select.options[i];
		blockId = currentOption.id.match(/[0-9]+/);
		if(blockId == num)
		{
			currentOption.selected = "selected";
			return true;
		}
	}
	alert("Error: " + option + " is not an available selection.");
	return false;
}

/* Gets the selected option of a select combo box
 *
 * Parameter:
 * element form - the combo box
 *
 * Returns selected option (string)
 */
function getSelectedOption(form)
{
	var index = form.selectedIndex;
	return form.options[index].value;
}


// Draws up the map image
function draw() 
{
	var ctx = document.getElementById("mapCanvas").getContext('2d');
	var img = new Image();
	// Stuff that happens when image loads
	img.onload = function()
	{
		var canvas = document.getElementById("mapCanvas");
		var width = img.naturalWidth;
		var height = img.naturalHeight;
		// Set canvas size to match image size
		canvas.width = width;
		canvas.height = height;
		// Draw up dat image yo  <- bored comment, totally professional
		ctx.drawImage(img, 0, 0, width, height);
		/* The below code draws UGLY gridlines on the map image
		ctx.lineWidth = 1;
		ctx.strokeStyle="black";
		for(var a = 0; a < width; a+=16)
		{
			for(var b = 0; b < height; b+=16)
			{
				ctx.strokeRect(a,b,(a+16),(b+16));
			}
		}
		*/
	};
	// Load image
	img.src = document.myCustomMapForm.hiddenMap.value;
	// Default click mode is set to "Add" (add units by clicking on the map image)
	setSelectedOption("Edit", document.topForm.sel_mapClickMode);
	// Sets up click mode
	setMapClickMode();
	// Sets all the map pointers and click positions to (0,0)
	resetMapPointerLoc();
}

// Load custom map from file
function uploadMap()
{
	document.myCustomMapForm.hiddenMap.value = document.myCustomMapForm.customMapImage.value;
	draw();
}


// Loads the selected map
function loadSelectedMap()
{
	// Gets map image from the dropdown list
	var selVal = getSelectedOption(document.myMapSelectForm.mapSelection);
	// Gets the value after the space in the dropdown list item
	var mapIndex = selVal.split(" ");
	document.myCustomMapForm.hiddenMap.value = "ChapterMaps/" + mapIndex.pop() + ".png";
	draw();
}

/* OUTDATED -- Checks if map sprites (and thus units) have been loaded on the map image.
 * If units have been loaded, ask the user if it's okay to delete the units.
 * If there are no units, it's all good.

function okayToDeleteUnitsOnMap()
{
	if(unitsOnMap())
	{
		return confirm("If you change maps, all current unit blocks will be deleted.\n" +
						"Do you still want to change maps? (Okay = change map)");
	}
	return true;
}

function unitsOnMap()
{
	var children = document.getElementById("mapImagesDiv").getElementsByTagName("IMG");
	for(var i = 0; i < children.length; i++)
	{
		if(children[i].id.indexOf("my") >= 0)
			return true;
	}
	return false;
}

 */
 
 /* Handles what happens when a unit's sprite on the map is clicked
  *
  * Parameters:
  * int unitNum - Id number of the unit that was clicked on
  * int listNum - Id number of the unit block the unit belongs to
  */
function clickImg(unitNum)
{
	var mode = getSelectedOption(document.topForm.sel_mapClickMode);
	// If click mode is "Add," only allow the user to set load coordinates
	if(mode == "Add")
	{
		setLoadCoord(unitNum);
		resetUnitFormToDefaultValues();
	}
	// If click mode is "Edit," load the clicked unit's data into the unit editor form
	else if(mode == "Edit")
		loadUnitDataFromEditor(unitNum);
	// If click mode is "Delete," delete the clicked unit
	else
		removeUnit(unitNum);
}

function resetUnitFormToDefaultValues()
{
	document.unitEditorForm.ckb_grayedOut.checked = "";
	
	document.unitEditorForm.rd_genericSprite.checked = "checked";
	document.unitEditorForm.rd_customSprite.checked = "";
	document.unitEditorForm.customMapSpriteImage.value = "";
	
	document.unitEditorForm.txt_shift_up_sprite.value = 0;
	document.unitEditorForm.txt_shift_left_sprite.value = 0;
	document.unitEditorForm.ckb_noequipped.checked = "";
	
	$(".weaponRank").each(function()
	{
		setSelectedOption("--",this);
	});
	
	$(".SkillOptions").each(function()
	{
		setSelectedOption("N/A",this);
	});
	
	$(".ItemOptions").each(function()
	{	
		setSelectedOption("No_Item", this);
	});
	updateItemMaxUses(1, "true");
	updateItemMaxUses(2, "true");
	updateItemMaxUses(3, "true");
	updateItemMaxUses(4, "true");
	updateItemMaxUses(5, "true");
	
	unequipWeapons();
	document.unitEditorForm.rd_equipped1.checked = "checked";
}

/* Get the map coordinates (in 16x16px tiles) of a unit sprite on the map
 *
 * Parameters:
 * element img - unit sprite image
 *
 * Returns an array containing x,y coordinates (in tiles) of the sprite's position on the map
 */
function getMapCoordFromImage(img)
{
	var raw_x = img.style.left;
	var raw_y = img.style.top;
	var x = (raw_x.match(/[0-9]+/))/16;
	var y = (raw_y.match(/[0-9]+/))/16;
	return [x,y];
}

/* Returns the map sprite element with the specified id number
 *
 * Parameter:
 * int num - unit id number
 *
 * Returns a map sprite element
 */
function getImgFromIdNum(num)
{
	var imgIdName = 'my'+num+'Img';
	if(num == -1)
		imgIdName = "StartPointer";
	else if(num == -2)
		imgIdName = "LoadPointer";
	return document.getElementById(imgIdName);
}

function updateClassBases(classList)
{
	var add = getSelectedOption(document.topForm.sel_mapClickMode);
	if(add == "Add")
	{
		var charClass = getSelectedOption(document.getElementById("sel_class"));
		var classInfo = classList[charClass];
		
		var baseSkill = classInfo["BaseSkill"];
		var stats = classInfo["BaseStats"];
		var weaponLvl = classInfo["WeaponLvl"];
		
		// BASE STATS
		if(stats != null && stats.length > 0)
			loadUnitStats(stats);
		
		if(weaponLvl != null && weaponLvl.length > 0)
			loadUnitWeaponLvls(weaponLvl);
		
		if(baseSkill != "" && baseSkill != null)
		{
			setSelectedOption(baseSkill, document.getElementById("sel_skill1"));
		}
		else
		{
			setSelectedOption("N/A", document.getElementById("sel_skill1"));
		}
		for(var j = 1; j < 5; j++)
		{
			var skillId = "sel_skill" + (j+1);
			setSelectedOption("N/A", document.getElementById(skillId));
		}
	}
}


function loadUnitData(contents)
{
	/*******EDIT THIS PLEASE
	Lyn LynLord MapSprites/LynLordAlly.png [0,0] [1,1,1] [1,1,1,1,1,1,1,1,1] [E,E,E,E,E,E,E] [SlimSword,SilverSword,LanceReaver,RuneSword,LightBrand] [Astra,Luna,Sol]
	
	******/
	// Parse raw unit code
	unequipWeapons();
	var cut1 = contents.split(" ");
	var character = cut1[0];
	if(character != "GenericChar")
	{
		document.unitEditorForm.rd_existingChar.checked = "checked";
		document.unitEditorForm.rd_genericChar.checked = "";
		setSelectedOption(character, document.unitEditorForm.sel_character);
	}
	else
	{
		document.unitEditorForm.rd_existingChar.checked = "";
		document.unitEditorForm.rd_genericChar.checked = "checked";
	}
	
	var u_class = cut1[1];
	setSelectedOption(u_class, document.unitEditorForm.sel_class);
	
	var side = cut1[2];
	setSelectedOption(side, document.unitEditorForm.sel_side);
	
	var mapSprite = cut1[3];
	if(mapSprite == "GenericSprite")
	{
		document.unitEditorForm.rd_genericSprite.checked = "checked";
		document.unitEditorForm.rd_customSprite.checked = "";
		document.unitEditorForm.rd_characterSprite.checked = "";
	}
	else if(mapSprite == "CharacterSprite")
	{
		document.unitEditorForm.rd_genericSprite.checked = "";
		document.unitEditorForm.rd_customSprite.checked = "";
		document.unitEditorForm.rd_characterSprite.checked = "checked";	
	}
	else
	{
		document.unitEditorForm.rd_genericSprite.checked = "";
		document.unitEditorForm.rd_characterSprite.checked = "";
		document.unitEditorForm.rd_customSprite.checked = 'checked';
		document.unitEditorForm.customMapSpriteImage.value = mapSprite;
	}
	
	var start = cut1[4].replace("[","").replace("]","").replace(" ","").split(",");
	document.unitEditorForm.txt_start_x.value = start[0];
	document.unitEditorForm.txt_start_y.value = start[1];
	
	var lvlHpExp = cut1[5].replace("[","").replace("]","").replace(" ","").split(",");
	document.unitEditorForm.txt_level.value = lvlHpExp[0];
	document.unitEditorForm.txt_current_hp.value = lvlHpExp[1];
	document.unitEditorForm.txt_exp.value = lvlHpExp[2];
	
	var stats = cut1[6].replace("[","").replace("]","").replace(" ","").split(",");
	loadUnitStats(stats);
	
	var weaponLvl = cut1[7].replace("[","").replace("]","").replace(" ","").split(",");
	loadUnitWeaponLvls(weaponLvl);
	
	var items = ["No_Item"];
	if(cut1[8] != "[]")
		items = cut1[8].replace("[","").replace("]","").split(",");
	
	while(items.length < 5)
		items.push("No_Item");
	
	for(var i = 0; i < 5; i++)
	{
		var selectId = "sel_item" + (i + 1);
		if(items[i] != "No_Item")
		{
			var itemCut1 = items[i].split("(");
			var itemName = itemCut1[0];
			var usesEquipped = itemCut1[1].replace(")","").split(";");
			setSelectedOptionByMatch(itemName, document.getElementById(selectId));
			var equipped = document.getElementById("rd_equipped" + (i + 1));
			if(usesEquipped[1] == "true")
				equipped.checked = "checked";
			else
				equipped.checked = "";
			document.getElementById("txt_item" + (i+1) + "_uses").value = usesEquipped[0];
		}
		else
			setSelectedOption("No_Item", document.getElementById(selectId));
		updateItemMaxUses(i+1, "false");
	}

	var skills = ["N/A"];
	if(cut1[9] != "[]")
		skills = cut1[9].replace("[","").replace("]","").split(",");
	while(skills.length < 5)
		skills.push("N/A");
	for(var j = 0; j < 5; j++)
	{
		var skillId = "sel_skill" + (j+1);
		if(skills[j] != "N/A")
		{
			setSelectedOption(skills[j], document.getElementById(skillId));
		}
		else
		{
			setSelectedOption("N/A", document.getElementById(skillId));
		}
	}
	
	var shift = cut1[10].replace("[","").replace("]","").replace(" ","").split(",");
	document.unitEditorForm.txt_shift_up_sprite.value = shift[0];
	document.unitEditorForm.txt_shift_left_sprite.value = shift[1];
	
	var battleStats = cut1[11].replace("[","").replace("]","").replace(" ","").split(",");
	document.unitEditorForm.txt_attack.value = battleStats[0];
	document.unitEditorForm.txt_hit.value = battleStats[1];
	document.unitEditorForm.txt_crit.value = battleStats[2];
	document.unitEditorForm.txt_avoid.value = battleStats[3];

	if(cut1[12] == "true")
		document.unitEditorForm.ckb_grayedOut.checked = "checked";
	else
		document.unitEditorForm.ckb_grayedOut.checked = "";
	
	var bonuses = cut1[13].replace("[","").replace("]","").replace(" ","").split(",");
	loadUnitStatBonuses(bonuses);
}

function loadUnitStats(stats)
{
	document.unitEditorForm.txt_max_hp.value = stats[0];
	document.unitEditorForm.txt_str.value = stats[1];
	document.unitEditorForm.txt_mag.value = stats[2];
	document.unitEditorForm.txt_skl.value = stats[3];
	document.unitEditorForm.txt_spd.value = stats[4];
	document.unitEditorForm.txt_lck.value = stats[5];
	document.unitEditorForm.txt_def.value = stats[6];
	document.unitEditorForm.txt_res.value = stats[7];
	document.unitEditorForm.txt_move.value = stats[8];
}

function loadUnitStatBonuses(bonuses)
{
	document.unitEditorForm.txt_max_hp_bonus.value = bonuses[0];
	document.unitEditorForm.txt_str_bonus.value = bonuses[1];
	document.unitEditorForm.txt_mag_bonus.value = bonuses[2];
	document.unitEditorForm.txt_skl_bonus.value = bonuses[3];
	document.unitEditorForm.txt_spd_bonus.value = bonuses[4];
	document.unitEditorForm.txt_lck_bonus.value = bonuses[5];
	document.unitEditorForm.txt_def_bonus.value = bonuses[6];
	document.unitEditorForm.txt_res_bonus.value = bonuses[7];
	document.unitEditorForm.txt_move_bonus.value = bonuses[8];
	document.unitEditorForm.txt_attack_bonus.value = bonuses[9];
	document.unitEditorForm.txt_hit_bonus.value = bonuses[10];
	document.unitEditorForm.txt_crit_bonus.value = bonuses[11];
	document.unitEditorForm.txt_avoid_bonus.value = bonuses[12];
}

function loadUnitWeaponLvls(weaponLvl)
{
	setSelectedOption(weaponLvl[0], document.getElementById("sel_swordRank"));
	setSelectedOption(weaponLvl[1], document.getElementById("sel_lanceRank"));
	setSelectedOption(weaponLvl[2], document.getElementById("sel_axeRank"));
	setSelectedOption(weaponLvl[3], document.getElementById("sel_bowRank"));
	setSelectedOption(weaponLvl[4], document.getElementById("sel_lightRank"));
	setSelectedOption(weaponLvl[5], document.getElementById("sel_darkRank"));
	setSelectedOption(weaponLvl[6], document.getElementById("sel_animaRank"));
	setSelectedOption(weaponLvl[7], document.getElementById("sel_staveRank"));
}

/* Loads the unit data of the specified unit to the Unit Editor form.
 * Called when editing units.
 *
 * Parameter:
 * int num - unit id number
 */
function loadUnitDataFromEditor(num)
{
	// Get raw unit code
	var unitId = "unit" + num;
	var contents = document.getElementById(unitId).innerHTML;
	loadUnitData(contents, true);
	
	// Sets the unit# to the id number of the unit being edited
	document.unitEditorForm.txt_unitNum.value = num;
	
	// Enable the edit button
	document.unitEditorForm.btn_editUnit.disabled = "";
}

/* Returns the data of a unit block, formatted as EA code
 * 
 * Parameter:
 * int num - unit block id number
 *
 * Returns unit block data as a string*/
 
function returnUnitData(num, charList)
{
	var characterName = "GenericChar";
	var mapSpriteLoc = setImgPos(num, charList);
	if(document.unitEditorForm.rd_genericSprite.checked)
		mapSpriteLoc = "GenericSprite";
	else if(document.unitEditorForm.rd_characterSprite.checked)
		mapSpriteLoc = "CharacterSprite";
	if(document.unitEditorForm.rd_existingChar.checked)
		characterName = getSelectedOption(document.unitEditorForm.sel_character);

  var grayedOut = document.unitEditorForm.ckb_grayedOut.checked;
  
  var x_st = document.unitEditorForm.txt_start_x.value;
  var y_st = document.unitEditorForm.txt_start_y.value;

  var u_class = getSelectedOption(document.unitEditorForm.sel_class);
  var side = getSelectedOption(document.unitEditorForm.sel_side);
  
  var level = document.unitEditorForm.txt_level.value;
  var current_hp = document.unitEditorForm.txt_current_hp.value;
  var exp = document.unitEditorForm.txt_exp.value;
  
  var max_hp = document.unitEditorForm.txt_max_hp.value;
  var str = document.unitEditorForm.txt_str.value;
  var mag = document.unitEditorForm.txt_mag.value;
  var skl = document.unitEditorForm.txt_skl.value;
  var spd = document.unitEditorForm.txt_spd.value;
  var lck = document.unitEditorForm.txt_lck.value;
  var def = document.unitEditorForm.txt_def.value;
  var res = document.unitEditorForm.txt_res.value;
  var move = document.unitEditorForm.txt_move.value;
  
  var max_hp_bonus = document.unitEditorForm.txt_max_hp_bonus.value;
  var str_bonus = document.unitEditorForm.txt_str_bonus.value;
  var mag_bonus = document.unitEditorForm.txt_mag_bonus.value;
  var skl_bonus = document.unitEditorForm.txt_skl_bonus.value;
  var spd_bonus = document.unitEditorForm.txt_spd_bonus.value;
  var lck_bonus = document.unitEditorForm.txt_lck_bonus.value;
  var def_bonus = document.unitEditorForm.txt_def_bonus.value;
  var res_bonus = document.unitEditorForm.txt_res_bonus.value;
  var move_bonus = document.unitEditorForm.txt_move_bonus.value;
  
  var attack = document.unitEditorForm.txt_attack.value;
  var hit = document.unitEditorForm.txt_hit.value;
  var crit = document.unitEditorForm.txt_crit.value;
  var avoid = document.unitEditorForm.txt_avoid.value;
  
  var attack_bonus = document.unitEditorForm.txt_attack_bonus.value;
  var hit_bonus = document.unitEditorForm.txt_hit_bonus.value;
  var crit_bonus = document.unitEditorForm.txt_crit_bonus.value;
  var avoid_bonus = document.unitEditorForm.txt_avoid_bonus.value;

  var sword = getSelectedOption(document.unitEditorForm.sel_swordRank);
  var lance = getSelectedOption(document.unitEditorForm.sel_lanceRank);
  var axe = getSelectedOption(document.unitEditorForm.sel_axeRank);
  var bow = getSelectedOption(document.unitEditorForm.sel_bowRank);
  var light = getSelectedOption(document.unitEditorForm.sel_lightRank);
  var dark = getSelectedOption(document.unitEditorForm.sel_darkRank);
  var anima = getSelectedOption(document.unitEditorForm.sel_animaRank);
  var stave = getSelectedOption(document.unitEditorForm.sel_staveRank);
  
  //Get all the items, can probably clean this up later
  var raw_item1 = getSelectedOption(document.unitEditorForm.sel_item1);
  var item1 = raw_item1.split(" ")[0] + 
				"(" + document.unitEditorForm.txt_item1_uses.value + ";" + 
				document.unitEditorForm.rd_equipped1.checked + ")";
  var raw_item2 = getSelectedOption(document.unitEditorForm.sel_item2);
  var item2 =  raw_item2.split(" ")[0] + 
				"(" + document.unitEditorForm.txt_item2_uses.value + ";" + 
				document.unitEditorForm.rd_equipped2.checked + ")";
  var raw_item3 = getSelectedOption(document.unitEditorForm.sel_item3);
  var item3 = raw_item3.split(" ")[0] + 
				"(" + document.unitEditorForm.txt_item3_uses.value + ";" + 
				document.unitEditorForm.rd_equipped3.checked + ")";
  var raw_item4 = getSelectedOption(document.unitEditorForm.sel_item4);
  var item4 = raw_item4.split(" ")[0] + 
				"(" + document.unitEditorForm.txt_item4_uses.value + ";" + 
				document.unitEditorForm.rd_equipped4.checked + ")";
  var raw_item5 = getSelectedOption(document.unitEditorForm.sel_item5);
  var item5 =  raw_item5.split(" ")[0] + 
				"(" + document.unitEditorForm.txt_item5_uses.value + ";" + 
				document.unitEditorForm.rd_equipped5.checked + ")";
  var itemArray = [item1, item2, item3, item4, item5];
  
  var skill1 = getSelectedOption(document.unitEditorForm.sel_skill1);
  var skill2 = getSelectedOption(document.unitEditorForm.sel_skill2);
  var skill3 = getSelectedOption(document.unitEditorForm.sel_skill3);
  var skill4 = getSelectedOption(document.unitEditorForm.sel_skill4);
  var skill5 = getSelectedOption(document.unitEditorForm.sel_skill5);
  var skillArray = [skill1, skill2, skill3, skill4, skill5];
  
  var itemsRemoved = 0;
  var skillsRemoved = 0;
  for(var i = 0; i < 5; i++)
  {
		if(itemArray[i-itemsRemoved].match(/No_Item/) != null)
		{
			itemArray.splice(i-itemsRemoved,1);
			itemsRemoved++;
		}
		if(skillArray[i-skillsRemoved] == "N/A")
		{
			skillArray.splice(i-skillsRemoved,1);
			skillsRemoved++;
		}
  }
  
  for(var k = 0; k < itemArray.length; k++)
  {
		var currentItem = itemArray[k];
		if(currentItem.match(/;true/) != null)
		{
			itemArray.splice(k,1);
			itemArray.splice(0,0,currentItem);
			break;
		}
  }
  
  var shiftUp = document.unitEditorForm.txt_shift_up_sprite.value;
  var shiftLeft = document.unitEditorForm.txt_shift_left_sprite.value;
  
  //var skillArray = all selected skills
  
  return characterName + " " + u_class + " " + side + " " + mapSpriteLoc + 
		' [' + x_st + ',' + y_st + ']' + ' [' + level + ',' + current_hp + ',' + exp + ']' +
		' [' + max_hp + ',' + str + ',' + mag + ',' + skl + ',' + spd + ',' + lck + ',' + def + ',' +
		res + ',' + move + '] [' + sword + ',' + lance + ',' + axe + ',' + bow + ',' + 
		light + ',' + dark + ',' + anima + ',' + stave + '] [' + itemArray + '] [' + skillArray + ']' +
		" [" + shiftUp + "," + shiftLeft + "] [" + attack + "," + hit + "," + crit + "," + avoid + "] " + grayedOut +
		" [" + max_hp_bonus + ',' + str_bonus + ',' + mag_bonus + ',' + skl_bonus + ',' + spd_bonus + ',' + 
		lck_bonus + ',' + def_bonus + ',' + res_bonus + ',' + move_bonus + "," + attack_bonus + "," + 
		hit_bonus + "," + crit_bonus + "," + avoid_bonus + "]";
}

// Updates Item Usage
function updateItemMaxUses(num, isNewWeapon)
{
	var item = getSelectedOption(document.getElementById("sel_item" + num));
	var mode = getSelectedOption(document.topForm.sel_mapClickMode);
	var uses = item.match(/[0-9]+/);
	if(item != "No_Item")
	{
		document.getElementById("txt_item" + num + "_max_uses").innerHTML = uses;
		if(mode == "Add" || isNewWeapon == "true")
			document.getElementById("txt_item" + num + "_uses").value = uses;
	}
	else
	{
		document.getElementById("txt_item" + num + "_max_uses").innerHTML = "--";
		document.getElementById("txt_item" + num + "_uses").value = 0;
	}
}

// Edits the data of the selected unit to match what is in the Unit Editor form
function editUnit(charList)
{
	var num = document.unitEditorForm.txt_unitNum.value;
	var unitId = "unit" + num;
	document.getElementById(unitId).innerHTML = returnUnitData(num, charList);
	//setImgPos(num, charList);
	saveDefOutput();
}

/* Gets the position (in 16x16px tiles) of the clicked area on the map.
 * Sets various input values equal to this position,
 * depending on which main form is selected (Unit Editor, Event Writer, or Condition Writer)
 *
 * Parameter:
 * event - associated with click event
 */
function getMapCoord(event)
{
	pos_x = event.offsetX?(event.offsetX):event.pageX-document.getElementById("mapImagesDiv").offsetLeft;
	pos_y = event.offsetY?(event.offsetY):event.pageY-document.getElementById("mapImagesDiv").offsetTop;
	// Divide the x and y click positions (pixels) by 16 pixels, then floor the result to get x and y map tile coordinates
	var imgWidth = (document.getElementById("mapCanvas").width)/16;
	var imgHeight = (document.getElementById("mapCanvas").height)/16;
	// Checks if the click position is at the very edge of the image
	// If the click is on the edge, subtract 1 from the final calculation
	var mapX = (Math.floor(pos_x/16)>=imgWidth)?(Math.floor(pos_x/16)-1):Math.floor(pos_x/16);
	document.mapClickPosForm.txt_mouseX.value = mapX;
	var mapY = (Math.floor(pos_y/16)>=imgHeight)?(Math.floor(pos_y/16)-1):Math.floor(pos_y/16);
	document.mapClickPosForm.txt_mouseY.value = mapY;
	updateUnitEditorMapCoord(mapX,mapY);
}

/* Updates the input values and pointers of the Unit Editor
 * to match the most recent map click position.
 *
 * Parameters:
 * int mapX - x-position of the map click (in 16x16px tiles)
 * int mapY - y-position of the map click (in 16x16px tiles)
 */
function updateUnitEditorMapCoord(mapX,mapY)
{
		document.unitEditorForm.txt_start_x.value = mapX;
		document.unitEditorForm.txt_start_y.value = mapY;
		// Reposition map sprite
		document.getElementById("StartPointer").style.left = mapX*16 + "px";
		document.getElementById("StartPointer").style.top = mapY*16 + "px";
		/* Uncomment this if you want the map sprite displayed before you add the unit
		document.getElementById("MapSprite").style.left = mapX*16 + "px";
		document.getElementById("MapSprite").style.top = mapY*16 + "px";
		*/
}

function setLoadCoord(num)
{
	var img = getImgFromIdNum(num);
	var arrayCoord = getMapCoordFromImage(img);
	mapX = arrayCoord[0];
	mapY = arrayCoord[1];
	if(num == -2)
	{
		document.getElementById("StartPointer").style.left = mapX*16 + "px";
		document.getElementById("StartPointer").style.top = mapY*16 + "px";
		document.unitEditorForm.txt_start_x.value = mapX;
		document.unitEditorForm.txt_start_y.value = mapY;
	}
	document.mapClickPosForm.txt_mouseX.value = mapX;
	document.mapClickPosForm.txt_mouseY.value = mapY;
	setEventPos(mapX,mapY);
}

/* Updates the input values and pointers of the Event Writer
 * to match the most recent map click position.
 *
 * Parameters:
 * int mapX - x-position of the map click (in 16x16px tiles)
 * int mapY - y-position of the map click (in 16x16px tiles)
 */
function updateEventWriterMapCoord(mapX,mapY)
{
	var eventType = getSelectedOption(document.topEventForm.sel_eventActionType).match(/[A-Za-z_]+/);
	var eventForm = document.getElementById("hd_selectedEventForm").value;
	if(eventType == "Event")			
		setEventPos(mapX,mapY);
	else if(eventType == "Manual_Move")
		setManualMoveStartPos(mapX, mapY);
}

/* Updates the input values and pointers of the Event Conditions form
 * to match the most recent map click position.
 *
 * Parameters:
 * int mapX - x-position of the map click (in 16x16px tiles)
 * int mapY - y-position of the map click (in 16x16px tiles)
 */
function updateConditionWriterMapCoord(mapX,mapY)
{
	var selectedXPosId = document.getElementById("hd_condXPosField").value;
	var selectedYPosId = document.getElementById("hd_condYPosField").value;
	if(selectedXPosId !== "" && selectedXPosId !== undefined && selectedXPosId !== null)
	{
		var selectedXPos = document.getElementById(selectedXPosId);
		var selectedYPos = document.getElementById(selectedYPosId);
		selectedXPos.value = mapX;
		selectedYPos.value = mapY;
		document.getElementById("GenPointer").style.left = mapX*16 + "px";
		document.getElementById("GenPointer").style.top = mapY*16 + "px";
	}
	else
	{
		document.getElementById("GenPointer").style.left = mapX*16 + "px";
		document.getElementById("GenPointer").style.top = mapY*16 + "px";
	}
}

/* Updates the input values and pointers of the Event Writer
 * (when default event block type is chosen)
 * to match the most recent map click position.
 *
 * Parameters:
 * int mapX - x-position of the map click (in 16x16px tiles)
 * int mapY - y-position of the map click (in 16x16px tiles)
 */
function setEventPos(mapX, mapY)
{
	var mapWidth = (document.getElementById("mapCanvas").width)/16;
	var mapHeight = (document.getElementById("mapCanvas").height)/16;
	var maxX = mapWidth - 8;
	var maxY = mapHeight - 6;
	var selectedXPosId = document.getElementById("hd_selectedXPosField").value;
	var selectedYPosId = document.getElementById("hd_selectedYPosField").value;

	if(selectedXPosId !== "" && selectedXPosId !== undefined && selectedXPosId !== null)
	{
		var selectedXPos = document.getElementById(selectedXPosId);
		var selectedYPos = document.getElementById(selectedYPosId);
		selectedXPos.value = mapX;
		selectedYPos.value = mapY;
		document.getElementById("GenPointer").style.left = mapX*16 + "px";
		document.getElementById("GenPointer").style.top = mapY*16 + "px";
	}
	else
	{
		document.getElementById("GenPointer").style.left = mapX*16 + "px";
		document.getElementById("GenPointer").style.top = mapY*16 + "px";
	}
}

/* Updates the input values and pointers of the Event Writer
 * (when manual move event block type is chosen)
 * to match the most recent map click position.
 *
 * Parameters:
 * int mapX - x-position of the map click (in 16x16px tiles)
 * int mapY - y-position of the map click (in 16x16px tiles)
 */
function setManualMoveStartPos(x,y)
{
	var listNum = getSelectedBlock("ManualMove");
	if(listNum >= 0)
	{
		var listId = "m_list" + listNum;
		var listContents = document.getElementById(listId).innerHTML;
		var isListEmpty = (listContents === null || listContents === undefined || listContents == "");
		var reset = (isListEmpty)?(true):(confirm("Changing the start position will clear all existing movements.\n" +
													"Change the start position anyway?"));
		if(reset)
		{
			clearManualMoveBlockContents(getSelectedBlock("ManualMove"));
			var startPointer = document.getElementById("ManualMoveStartPointer");
			var endPointer = document.getElementById("ManualMoveEndPointer");
			startPointer.style.left = x*16 + "px";
			startPointer.style.top = y*16 + "px";
			endPointer.style.left = x*16 + "px";
			endPointer.style.top = y*16 + "px";
			var blockNum = getSelectedBlock('ManualMove');
			document.getElementById("manualMoveStart" + blockNum).value = x + "," + y;
			document.mapClickPosForm.txt_mouseX.value = x;
			document.mapClickPosForm.txt_mouseY.value = y;
		}
	}
	else
		alert("No manual move blocks exist.\n" + 
			"Create a manual move block first.");
}

/* Updates the recorded x,y positions of the currently selected input
 * in the Event Writer form to match the most recent map click position.
 *
 * Parameters:
 * int x - x-coordinate (in 16x16px tiles) of the most recent map click position
 * int y - y-coordinate (in 16x16px tiles) of the most recent map click position
 */
function setSelectedPosIds(x,y)
{
	document.getElementById("hd_selectedXPosField").value = x;
	document.getElementById("hd_selectedYPosField").value = y;
}

/* Updates the recorded x,y positions of the currently selected input
 * in the Event Conditions form to match the most recent map click position.
 *
 * Parameters:
 * int x - x-coordinate (in 16x16px tiles) of the most recent map click position
 * int y - y-coordinate (in 16x16px tiles) of the most recent map click position
 */
function setSelectedCondPosIds(x,y)
{
	document.getElementById("hd_condXPosField").value = x;
	document.getElementById("hd_condYPosField").value = y;
}

/******COMMENTS UNFINISHED BELOW THIS LINE********/

function clearManualMoveBlockContents(blockNum)
{
	var id = "manualMove" + blockNum + "Id";
	var imgId = "moveImg" + blockNum;
	document.getElementById(id).value = "0";
	$("#manualMoveImgDiv > img").each(function()
	{
		var currentImgId = "" + this.id;
		if(currentImgId.indexOf(imgId) == 0)
			$("#" + currentImgId).remove();
	});
	var listId = "m_list" + blockNum;
	document.getElementById(listId).innerHTML = "";
}

function uncheck(radio)
{
	radio.checked = "";
}

function unequipWeapons()
{
	$(".equipped").each(function()
	{
		this.checked = "";
	});
}

function addEventAction(actionDataArray)
{
	var insertPoint = document.eventAdderForm.txt_eventInsertionPoint.value;
	var insertPointDiv = "action" + insertPoint;
	var eventNum = getSelectedBlock("Event");
	var eventListId = "e_list" + eventNum;
	var parent = document.getElementById(eventListId);
	var num = getNewBlockElementIdNum("action");
	var newdiv = document.createElement('div');
	var divIdName = 'action' + num;
	newdiv.setAttribute('id',divIdName);
	var actionData = actionDataArray[0];
	
	if(actionDataArray != "invalid input")
	{
		actionData += (document.eventAdderForm.ckb_removeAllText.checked)?("REMA\n"):("");
		actionData += (document.eventAdderForm.ckb_removeTextbox.checked)?("RETB\n_0x89\n"):("");
		actionData += (document.eventAdderForm.ckb_removeOnlyTextBubble.checked)?("REBU\n"):("");
		actionData += (document.eventAdderForm.ckb_pauseUntilFinished.checked)?("ENUN\n"):("");
		actionData += "  // <a href='javascript:setEventInsertionPoint(" + num + "," + eventNum + ");'>Insert Pt.</a>&nbsp;&nbsp;" +
						"<a href='javascript:removeAction(" + num + "," + eventNum + ");'>Delete</a>" +
						"<input type='hidden' id='hd_eventCode" + num + "' value='" + actionDataArray[1] + "'>";
		actionData = "<img src='BlockIcons/SelectArrow.png'>" + actionData;
		newdiv.innerHTML = actionData;
		if(insertPoint == "")
			parent.appendChild(newdiv);
		else if(insertPoint == "-1")
		{
			$("#action-1_" + eventNum).after(newdiv);
		}
		else
		{
			$("#" + insertPointDiv).after(newdiv);
			removeInsertionPointer(insertPointDiv);
		}
		document.eventAdderForm.txt_eventInsertionPoint.value = num;
		updateEventOutput();
		// If there is a closing action selected
		var closeSet = document.getElementById("sel_closeActionSet");
		var selectedClose = closeSet.selectedIndex;
		if(selectedClose >= 0)
		{
			var code = "" + closeSet.options[0].value;
			closeSet.remove(0);
			if(closeSet.options[0] === undefined)
				document.getElementById("closeActionDiv").style.display = "none";
			if(code.indexOf("FADU") == 0)
				addEventAction(["Fade(false,true," + code.match(/[0-9]+/) + ")", code]);
			else if(code.indexOf("FAWU") == 0)
				addEventAction(["Fade(false,false," + code.match(/[0-9]+/) + ")", code]);
		}
		else
		{
			// Get the type of event action that is being added, which is stored in "hd_selectedEventForm"
			var actionType = document.getElementById("hd_selectedEventForm").value;
			if(actionType == "fade_set")
			{
				$("#sel_closeActionSet").prepend("<option id='closeAction" + num + "_" + eventNum + "'>" 
													+ actionDataArray[1].replace("I","U") + optionClosed);
				document.getElementById("closeActionDiv").style.display = "inline";
			}
		}
	}
	else
		alert("Error: Some required values were left blank.\nAction was not added.");
}

function setEventInsertionPoint(num, blockNum)
{
	var selectedBlock = getSelectedBlock('Event');
	if(blockNum == selectedBlock)
	{
		var prevId = document.eventAdderForm.txt_eventInsertionPoint.value;
		if(prevId !== undefined && prevId !== "")
		{
			removeInsertionPointer("action" + prevId);
		}
		document.eventAdderForm.txt_eventInsertionPoint.value = num;
		setInsertionPointer("action" + num);
	}
}

function removeInsertionPointer(id)
{
	var prevDivContent = "" + document.getElementById(id).innerHTML;
	document.getElementById(id).innerHTML = prevDivContent.replace("<img src=\"BlockIcons/SelectArrow.png\">","");
}

function setInsertionPointer(id)
{
	document.getElementById(id).innerHTML = "<img src=\"BlockIcons/SelectArrow.png\">" +
											document.getElementById(id).innerHTML;
}

function setScriptedFightInsertionPoint(num, blockNum)
{
	var selectedBlock = getSelectedBlock('ScriptedFight');
	if(blockNum == selectedBlock)
		document.scriptedFightAdderForm.hd_scriptedFightInsertionPoint.value = num;
}

function getNewBlockElementIdNum(type)
{
  var id = type + "Id";
  var numi = document.getElementById(id);
  var num = (document.getElementById(id).value -1)+ 2;
  numi.value = num;
  return num;
}

// Add new unit
function addUnit(charList)
{
	var parent = document.getElementById("unitBlockDiv");
	var num = getNewBlockElementIdNum("unit");
	var newdiv = document.createElement('div');
	var divIdName = 'unit' + num;
	newdiv.setAttribute('id',divIdName);

	var mapDiv = document.getElementById('mapImagesDiv');
	var newImg = document.createElement('img');
	var imgIdName = 'my'+num+'Img';
	newImg.setAttribute('id',imgIdName);
	imgClick = "clickImg(" + num + ");";
	newImg.setAttribute('onclick', imgClick);
	mapDiv.appendChild(newImg);
	
	var unitData = returnUnitData(num, charList);
	newdiv.innerHTML = unitData;
	parent.appendChild(newdiv);
	
	// If the x starting position is greater than 0, shift cursor to the left.
	// Otherwise, shift cursor to the right.
	var x_st = document.unitEditorForm.txt_start_x.value;
	x_st = (x_st > 0)?(x_st-1):(1);
	document.unitEditorForm.txt_start_x.value = x_st;
	document.getElementById("StartPointer").style.left = x_st*16 + "px";
	saveDefOutput();
}

// Remove unit
function removeUnit(divNum)
{
  var divIdName = 'unit' + divNum;
  var imgIdName = 'my' + divNum + 'Img';
  var d = document.getElementById('unitBlockDiv');
  var olddiv = document.getElementById(divIdName);
  d.removeChild(olddiv);
  var mapd = document.getElementById('mapImagesDiv');
  var oldImg = document.getElementById(imgIdName);
  mapd.removeChild(oldImg);
  saveDefOutput();
}

function setImgPos(num, charList)
{
  var x_st = document.unitEditorForm.txt_start_x.value;
  
  var y_st = document.unitEditorForm.txt_start_y.value;
  var shiftUp = document.unitEditorForm.txt_shift_up_sprite.value;
  var shiftLeft = document.unitEditorForm.txt_shift_left_sprite.value;
  
  var imgid = "my" + num + "Img";
  var img = document.getElementById(imgid);
  
  if(document.unitEditorForm.rd_genericSprite.checked)
  {
	  var u_class = getSelectedOption(document.unitEditorForm.sel_class).match(/[A-Za-z0-9_]+/);
	  var imgClass;
	  var alleg = getSelectedOption(document.unitEditorForm.sel_side);
	  if(mapSpriteDict[u_class] !== undefined)
	  {
		imgClass = mapSpriteDict[u_class];
	  }
	  else
		imgClass = "Generic";
	  imageUrl = "MapSprites/" + imgClass + alleg + ".png";
	}
	else if(document.unitEditorForm.rd_characterSprite.checked)
	{
		var charName = getSelectedOption(document.unitEditorForm.sel_character);
		var charSprite = charList[charName]["MapSprite"];
		if(charSprite != null && charSprite != undefined && charSprite != "")
		{
			imageUrl = charSprite;
		}
	}
	else
	{
		imageUrl = document.unitEditorForm.customMapSpriteImage.value;
	}
  
  img.src = imageUrl;
  img.style.position = "absolute";
  img.style.left = (x_st*16)-shiftLeft + "px";
  img.style.top = (y_st*16)-shiftUp + "px";
  if(document.unitEditorForm.ckb_grayedOut.checked)
	img.className = "grayScale";
  else
	img.className = "";
  return imageUrl;
}

function ungrayAllUnits()
{
	$('#mapImagesDiv > img').each(function()
	{
		if(this.id != "StartPointer")
			this.className = "";
	});
	$('#unitBlockDiv > div').each(function()
	{
		var code = this.innerHTML;
		code = code.replace("] true", "] false");
		this.innerHTML = code;
	});
	saveDefOutput();
}

function toggleBlock(num)
{
	var listid = "b_list" + num;
	var isHidden = document.getElementById(listid).style.display;
	if(isHidden != "none")
		hideUnitList(num,true);
	else
		hideUnitList(num,false);
}

function hideUnitList(num,hide)
{
	var listid = "b_list" + num;
	var endid = "b_end" + num;
	var imgid = "minMaxImg" + num;
	if(hide)
	{
		document.getElementById(listid).style.display = "none";
		document.getElementById(endid).style.display = "none";
		document.getElementById(imgid).src = "BlockIcons/Maximize.png";
	}
	else
	{
		document.getElementById(listid).style.display = "";
		document.getElementById(endid).style.display = "";
		document.getElementById(imgid).src = "BlockIcons/Minimize.png";
	}	
}

function toggleEventBlock(id)
{
	var listid, imgid;
	if(typeof id == "number")
	{
		var selectedForm = "" + getSelectedOption(document.topEventForm.sel_eventActionType);
		var firstLetter = selectedForm[0];
		listid = firstLetter.toLowerCase() + "_list" + id;
		imgid = "minMaxImg" + firstLetter + id;
	}
	else
	{
		listid = id.toLowerCase() + "_list";
		imgid = "minMaxImg" + id;
	}
	var isHidden = document.getElementById(listid).style.display;
	if(isHidden != "none")
	{
		document.getElementById(listid).style.display = "none";
		document.getElementById(imgid).src = "BlockIcons/Maximize.png";
	}
	else
	{
		document.getElementById(listid).style.display = "";
		document.getElementById(imgid).src = "BlockIcons/Minimize.png";
	}
}

function toggleInvisibleArrows(num)
{
	var countId = "manualMove" + num + "Id";
	var visId = "visImgM" + num;
	var imgSrc = document.getElementById(visId).src;
	var arrowNum = document.getElementById(countId).value;
	var isVisible = (imgSrc.indexOf("Invisible") >= 0);
	var visibilityStyle = (isVisible)?("inline"):("none");
	// Checks if there are any arrows in the block
	if(arrowNum > 0)
	{
		for(var i = 1; i <= arrowNum; i++)
			document.getElementById("moveImg" + num + "_" + i).style.display = visibilityStyle;
	}
	var visibility = (isVisible)?("Visible"):("Invisible");
	document.getElementById(visId).src = "BlockIcons/" + visibility + ".png";
}

function toggleInvisibleUnits(num)
{
	var visId = "visImg" + num;
	var imgSrc = document.getElementById(visId).src;
	var isVisible = (imgSrc.indexOf("Invisible") >= 0);
	var visibility = (isVisible)?("Visible"):("Invisible");
	changeVisibilityOfUnitBlock(num,isVisible);
	document.getElementById(visId).src = "BlockIcons/" + visibility + ".png";
}

function changeVisibilityOfUnitBlock(num,isVisible)
{
	var visId = "visImg" + num;
	var imgSrc = document.getElementById(visId).src;

	var listid = "b_list" + num;
	var unitsInList = document.getElementById(listid).innerHTML;
	
	var visStyle = (isVisible)?("inline"):("none");
	var unitIdArray = getAllIdsInBlock(num, "Unit");
	
	// Checks if there are any units in the block
	if(unitsInList.indexOf("UNIT") >= 0)
	{
		for(var i = 0; i < unitIdArray.length; i++)
			document.getElementById("my" + unitIdArray[i] + "Img").style.display = visStyle;
	}
}

function shiftBlocks(type)
{
	var blockNum = getSelectedBlock(type);
	var lowerType = lowerCaseFirstLetter(type);
	var blockid = "#" + lowerType + "Block" + blockNum;
	var visId = "visImg" + type[0].replace("U", "") + blockNum;
	var img = document.getElementById(visId);
	if(img !== null && img !== undefined)
	{
		var imgSrc = img.src;
		if(imgSrc.indexOf("Invisible") >= 0)
		{
			if(type == "Unit")
				toggleInvisibleUnits(blockNum);
			else if(type == "ManualMove")
				toggleInvisibleArrows(blockNum);
		}
	}
	if(lowerType == "manualMove")
	{
		var prevBlockId = document.getElementById("manualMoveBlockDiv").firstChild.id;
		var prevblockNum = prevBlockId.match(/[0-9]+/);
		var endPointer = document.getElementById("ManualMoveEndPointer");
		var coordArray = getMapCoordFromImage(endPointer);
		var x = coordArray[0];
		var y = coordArray[1];
		document.getElementById("manualMoveEnd" + prevblockNum).value = x + "," + y;
		
		var raw_coords = document.getElementById("manualMoveEnd" + blockNum).value;
		coordArray = raw_coords.split(",");
		endPointer.style.left = coordArray[0]*16 + "px";
		endPointer.style.top = coordArray[1]*16 + "px";
		document.mapClickPosForm.txt_mouseX.value = coordArray[0];
		document.mapClickPosForm.txt_mouseY.value = coordArray[1];
		
		var startPointer = document.getElementById("ManualMoveStartPointer");
		raw_coords = document.getElementById("manualMoveStart" + blockNum).value;
		coordArray = raw_coords.split(",");
		startPointer.style.left = coordArray[0]*16 + "px";
		startPointer.style.top = coordArray[1]*16 + "px";
	}
	else if(lowerType == "event")
	{
		var prevNum = document.eventAdderForm.txt_eventInsertionPoint.value;
		if(prevNum !== null && prevNum !== undefined && prevNum !== "")
			removeInsertionPointer("action" + prevNum);
		document.eventAdderForm.txt_eventInsertionPoint.value = "";
	}
	else if(lowerType == "scriptedFight")
		document.scriptedFightAdderForm.hd_scriptedFightInsertionPoint.value = "";
	$(blockid).hide().prependTo("#" + lowerType + "BlockDiv").slideDown();
}

// Add new block
function addBlock(type)
{
  var newBlock = "txt_new" + type + "Block";
  var raw_name = document.getElementById(newBlock).value;
  var name = "" + raw_name.match(/[a-zA-Z0-9_\(\)]+/);
  if(name == '' || name == null)
  {
	alert("Please enter a valid name for the new " + lowerCaseFirstLetter(type) + " block.\n" +
		  "(Numbers, letters, and underscores only)");
  }
  else if(existingPointerNames.indexOf(name) >= 0)
  {
	alert("The pointer name \"" + name + "\" is already being used.\n" +
		"Please enter a new unique block name.");
  }
  else
  {
	existingPointerNames.push(name);
	var parentId = lowerCaseFirstLetter(type) + "BlockDiv";
	var numId = lowerCaseFirstLetter(type) + "Block";
	var parent = document.getElementById(parentId);
	var num = getNewBlockElementIdNum(numId);
	var newdiv = document.createElement('div');
	var divIdName = lowerCaseFirstLetter(type) + 'Block' + num;
	newdiv.setAttribute('id',divIdName);
	if(type == "Unit")
	{
		newdiv.innerHTML = "<div id='b_name" + num + "' class='b_name'>" + name + ":" +
							"<a href='javascript:toggleBlock(" + num + ");'>" +
							"<img src='BlockIcons/Minimize.png'" +
							" id='minMaxImg" + num + "' class='minMaxImg'></a>" +
							"<a href='javascript:toggleInvisibleUnits(" + num + ");'>" +
							"<img src='BlockIcons/Visible.png'" +
							" id='visImg" + num + "' class='minMaxImg'></a></div>" +
							"<div id='b_list" + num + "'> </div>" +
							"<div id='b_end" + num + "'>UNIT</div>";
	}
	else if(type == "Event")
	{
		newdiv.innerHTML = "<div id='e_name" + num + "' class='b_name'>" + name + ":" +
						   "<a href='javascript:toggleEventBlock(" + num + ");'>" +
						   "<img src='BlockIcons/Minimize.png'" +
						   " id='minMaxImgE" + num + "' class='minMaxImg'></a></div>" +
						   "<div id='e_list" + num  + "'><div id='action-1_" + num + "'>" +
						   "<a href='javascript:setEventInsertionPoint(-1," + num + ");'>Insert At Beginning</a>&nbsp;&nbsp;" +
						   "<a href='javascript:setEventInsertionPoint(\"\"," + num + ");'>Insert At End</a></div></div>";
	}
	else if(type == "ManualMove")
	{
		newdiv.innerHTML = "<div id='m_name" + num + "' class='b_name'>" + name + ":" +
							"<a href='javascript:toggleEventBlock(" + num + ");'>" +
						   "<img src='BlockIcons/Minimize.png'" +
						   " id='minMaxImgM" + num + "' class='minMaxImg'></a>" +
						   "<a href='javascript:toggleInvisibleArrows(" + num + ");'>" +
							"<img src='BlockIcons/Visible.png'" +
							" id='visImgM" + num + "' class='minMaxImg'></a></div>" +
						   "<input type='hidden' id='manualMove" + num + "Id' value='0'>" +
						   "<input type='hidden' id='manualMoveStart" + num + "' value='0,0'>" +
						   "<input type='hidden' id='manualMoveEnd" + num + "' value='0,0'>" +						   
						   "<div id='m_list" + num  + "'></div>";
	}
	else if(type == "ScriptedFight")
	{
		newdiv.innerHTML = "<div id='s_name" + num + "' class='b_name'>" + name + ":" +
						   "<a href='javascript:toggleEventBlock(" + num + ");'>" +
						   "<img src='BlockIcons/Minimize.png'" +
						   " id='minMaxImgS" + num + "' class='minMaxImg'></a></div>" +
						   "<div id='s_list" + num  + "'><div id='action-1_" + num + "'>" +
						   "<a href='javascript:setScriptedFightInsertionPoint(-1," + num + ");'>Insert At Beginning</a></div></div>";
	}	
	parent.appendChild(newdiv);
	var otherBlocksExist = (document.getElementById("sel_" + lowerCaseFirstLetter(type) + "Block").options.length > 0);
	var optionOpenWithId = (otherBlocksExist)?("<option id='select" + type + "Block" + num + "'>"):
											  ("<option id='select" + type + "Block" + num + "' selected='selected'>");
	$("#sel_" + lowerCaseFirstLetter(type) + "Block").append(optionOpenWithId + name + optionClosed);
	updateAllBlockSelectors(type);
  }
  document.getElementById(newBlock).value = "";
  updateEventOutput();
}

function updateAllBlockSelectors(type)
{
	var blockArray = [];
	var blocks = document.getElementById("sel_" + lowerCaseFirstLetter(type) + "Block");
	for(var i = 0; i < blocks.options.length; i++)
		blockArray.push(blocks.options[i].value);
	updateSelectOptions('.' + type + 'Blocks',blockArray);
}

function removeItemFromArray(item, array)
{
	var index = array.indexOf(item);
	array.splice(index, 1);
}

function removeBlock(input,type)
{
	var blockNum = getSelectedBlock(type);
	var form = document.getElementById("sel_" + lowerCaseFirstLetter(type) + "Block");
	var index = form.selectedIndex;
	var blockName = getSelectedOption(form);
	if(input)
	{
		form.remove(index);
		removeItemFromArray(blockName, existingPointerNames);
		updateAllBlockSelectors(type);
		var divIdName = lowerCaseFirstLetter(type) + "Block" + blockNum;
		var parent = document.getElementById(lowerCaseFirstLetter(type) + "BlockDiv");
		var olddiv = document.getElementById(divIdName);
		var idArray = getAllIdsInBlock(blockNum, type);
		if(idArray !== null)
		{
			for(var i = 0; i < idArray.length; i++)
			{
				if(type == "Unit")
					removeUnit(idArray[i], blockNum);
			}
		}
		if(type == "ManualMove")
			clearManualMoveBlockContents(blockNum);
		parent.removeChild(olddiv);
	}
	updateEventOutput();
}

function getAllIdsInBlock(blockNum, type)
{
	var num_regex = new RegExp("[0-9]+","g");
	var id;
	var first = "";
	if(type == "Unit")
		id = "#b_list" + blockNum + " > div";
	else if(type == "Event")
		id = "#e_list" + blockNum + " > div";
	else if(type == "ScriptedFight")
		id = "#s_list" + blockNum + " > div";
	else if(type == "Condition")
		id = blockNum + "_list > div";
	var idString = $(id).map(function()
		{
			var idString = "" + this.id;
			if(idString.indexOf("-1") < 0)
				return this.id;
		}).get().join(',');
	return idString.match(num_regex);
}

function confirmRemoveBlock(type)
{
	var blockName = getSelectedOption(document.getElementById("sel_" + lowerCaseFirstLetter(type) + "Block"));
	if(type == "Unit" && (blockName == "Good" || blockName == "Bad"))
	{
		alert("Cannot delete block " + blockName + ".");
		return false;
	}
	else if(type == "Event" && (blockName == "Opening_event" || blockName == "Ending_event" || 
								blockName == "EventAfterExitingPrepScreen"))
	{
		alert("Cannot delete " + blockName + ".");
		return false;
	}
	return confirm("Forever DELETE unit block " + blockName + "?  (Ok = Delete)");
}

function uploadDef()
{
	if (window.File && window.FileReader && window.FileList && window.Blob)
	{
		var f = document.topForm.file_customDef.files[0];

		if(f)
		{
			var r = new FileReader();
			r.onload = function(e) 
			{
				document.topForm.sel_chosenDef.selectedIndex = 0;
				clearAllOptions();
				var contents = e.target.result;
				if(isValidDefContent(contents))
				{
					readDefFile(contents);
					document.unitEditorForm.btn_addUnit.disabled = "";
				}
				else
					document.unitEditorForm.btn_addUnit.disabled = "disabled";
			}
			r.readAsText(f);
		} 
		else
			alert("Failed to load file.");
	} 
	else
	{
		alert('The File APIs are not fully supported by your browser. \n' +
			  'Try using Firefox instead. :)');
	}
}

function getDefinitionText(selection)
{
	var choice = selection + "_Def";
	document.unitEditorForm.btn_addUnit.disabled = "";
	var defContainer = document.getElementById(choice);
	if(defContainer.tagName.toLowerCase() == "iframe")
	{
		var iframe_window = window.frames[choice];
		return iframe_window.document.getElementById("info").innerHTML;
	}
	else
		return defContainer.value;
}

/*function getChapterPointers()
{
	var validForm = new RegExp("0x[0-9A-Z][0-9A-Z] ((Prologue)|(Ch.[0-9]+([A-Z]|[x])?([/][0-9]+)?)|(Final Ch. pt[1-2]))","g");
	var raw_content = getDefinitionText("Pointers").split("Events");
	var chaptPointer, chapterPointerArray;
	var validChaptPointers = [];
	for(var i = 0; i < raw_content.length; i++)
	{
		chaptPointerArray = raw_content[i].match(validForm);
		if(chaptPointerArray !== undefined && chaptPointerArray !== null)
		{
			chaptPointer = chaptPointerArray[chaptPointerArray.length-1];
			validChaptPointers.push(chaptPointer);
		}
	}
	var lollazy = []; // Use to get definitions
	for(var i = 0; i < validChaptPointers.length; i++)
	{
		lollazy.push('"' + validChaptPointers[i] + '"');
	}
	alert(lollazy);
	updateSelectOptions(document.getElementById("sel_chosenChapter"),validChaptPointers);
}

function getChapterIds()
{
	var validForm = new RegExp("[A-Za-z0-9_]+ 0x[0-9A-Z]{2}","g");
	var chaptIds = getDefinitionText("FE7_ChaptIds");
	var validIds = chaptIds.match(validForm);
	updateSelectOptions(".ChaptIdsList",validIds);
}

function getFE7Music()
{
	var validForm = new RegExp("0x[A-F0-9]+ [A-Za-z 0-9'!-:\?\(]+","g");
	var songs = getDefinitionText("MusicFE7");
	var validSongs = songs.match(validForm);
	updateSelectOptions(".MusicList",validSongs);
}

function getFE7Backgrounds()
{
	var validForm = new RegExp("0x[0-9A-F]{2} - [A-Za-z 0-9'!-:\?\(]+","g");
	var backgrounds = getDefinitionText("FE7Backgrounds");
	var validBackgrounds = backgrounds.match(validForm);
	updateSelectOptions(".BackgroundList",validBackgrounds);
}*/

function selectDef()
{
	clearAllOptions();
	var choice = getSelectedOption(document.topForm.sel_chosenDef);
	if(choice == "FE7")
	{
		setDefinitionArray(FE7CharacterDefs,".Char");
		setDefinitionArray(FE7ClassDefs,".Classes");
		setDefinitionArray(FE7ItemDefs,".Item");
		document.unitEditorForm.btn_addUnit.disabled = "";		
	}
	else if(choice == "Zhack")
	{
		setDefinitionArray(ZhackCharDefs,".Char");
		setDefinitionArray(ZhackClassDefs,".Classes");
		setDefinitionArray(ZhackItemDefs,".Item");
		document.unitEditorForm.btn_addUnit.disabled = "";
	}
	else if(choice != "N/A")
	{
		var content = getDefinitionText(choice);
		readDefFile(content);
	}
	else
		document.unitEditorForm.btn_addUnit.disabled = "disabled";
}

function processDefRequests(contents,select)
{
	var request = arguments[2];	
	var data = getDefinitionArray(contents);
	
	if(request !== undefined && request !== null)
		return data;
	else
		setDefinitionArray(data, select);
}

function getDefinitionArray(contents)
{
	var hash = new RegExp("(#[a-zA-Z]+)","g");
	var dataWithId = new RegExp("[a-zA-Z0-9_\(\)]+ 0x[0-9a-zA-Z][0-9a-zA-Z]?","g");	
	var raw_data = contents.replace(hash,"");
	var data = raw_data.match(dataWithId);
	/*var lollazy = []; // Use to get definitions
	/*for(var i = 0; i < data.length; i++)
	{
		lollazy.push('"' + data[i] + '"');
	}
	alert(lollazy);*/
	
	return data;
}

function setDefinitionArray(data, select)
{
	updateSelectOptions(select,data);
	if(select == ".Item")
	{
		data.unshift("No_Item");
		updateSelectOptions(".ItemOptions", data);
		data.splice(0,1);
	}
	if(select == ".Char")
	{
		data.unshift("None");
		updateSelectOptions("#sel_leadChar", data);
		data.splice(0,1);
	}
}

// Checks if the definitions are properly formatted.
function isValidDefContent(raw_content)
{
	var d_slash = new RegExp("//[a-zA-Z0-9 ]+","g");
	var content = raw_content.split(d_slash);
	var mapping = ["","CHARACTER","CLASS","ITEM"];
	var def = new RegExp("#[a-zA-Z]+ [a-zA-Z0-9_\(\)]+ 0x[0-9a-zA-Z][0-9a-zA-Z]?","g");
	if(content === undefined || content === null)
	{
		alert("Error: Provided definitions contain no text.\n" +
			  "Definitions could not be loaded.");
		return false;
	}
	else if(content.length == 1)
	{
		alert("Error: Provided definitions are incorrectly formatted.\n" +
			  "Definitions could not be loaded.");
		return false;
	}
	else
	{
		for(var i = 1; i <= 3; i++)
		{
			if(content[i] === undefined || content[i] === null)
			{
				alert("Error: Provided definitions are missing " + mapping[i] + " definitions.\n" +
					  "Definitions could not be loaded.");
				return false;
			}
			var matchFound = content[i].match(def);
			if(matchFound === undefined || matchFound === null)
			{
				alert("Error: Provided " + mapping[i] + " definitions are incorrectly formatted.\n" +
					  "Definitions could not be loaded.");
				return false;
			}
		}
	}
	return true;
}

function readDefFile(contents)
{
	if(isValidDefContent(contents))
	{
		var request = arguments[1];
		var d_slash = new RegExp("//[a-zA-Z0-9 ]*","g");
		var sections = contents.split(d_slash);
		if(request !== undefined && request !== null)
		{
			if(request.indexOf("Character") >= 0)
				return processDefRequests(sections[1],".Char",request);
			else if(request.indexOf("Class") >= 0)
				return processDefRequests(sections[2],".Classes",request);
			else if(request.indexOf("Item") >= 0)
				return processDefRequests(sections[3],".Item",request);
		}
		else
		{
			processDefRequests(sections[1],".Char");
			processDefRequests(sections[2],".Classes");
			processDefRequests(sections[3],".Item");
		}
	}
}

function updateDefType()
{
	var choice = getSelectedOption(document.defMakerForm.sel_defType);
	if(choice == "Character")
		updateSelectOptions("#sel_origDef",FE7CharacterDefs);
	else if(choice == "Class")
		updateSelectOptions("#sel_origDef",FE7ClassDefs);
	else
		updateSelectOptions("#sel_origDef",FE7ItemDefs);
}

function addCustomDef()
{
	var type = getSelectedOption(document.defMakerForm.sel_defType).toLowerCase();
	var replacement = document.defMakerForm.txt_customDef.value.match(/[a-zA-Z0-9_]+/);
	var defNum = getSelectedOption(document.defMakerForm.sel_origDef).match(/0x[0-9][0-9]?/);
	var outputId = "hdn_" + type + "DefOutput";
	oldContent = document.getElementById(outputId).value;
	if(replacement === undefined || replacement === null)
	{
		alert("Please enter a valid definition name.\n" +
			  "(Numbers, letters, and underscores only)");
	}
	else
	{
		document.getElementById(outputId).value = oldContent + "\n#define " + replacement + " " + defNum;
		getDefinitionsOutput();
	}
}

function getDefinitionsOutput()
{
	var charOutput = document.getElementById("hdn_characterDefOutput").value;
	var classOutput = document.getElementById("hdn_classDefOutput").value;
	var itemOutput = document.getElementById("hdn_itemDefOutput").value;
	var output = document.getElementById("txa_finalDefOutput");
	output.value = charOutput + " \n\n" + classOutput + " \n\n" + itemOutput;
}

function addNewDefsToList()
{
	var defName = document.defMakerForm.txt_customDefName.value;
	if(defName == "")
		alert("Please name your definitions file.");
	else
	{
		var parent = document.getElementById("storedDefContentDiv");
		var content = document.getElementById("txa_finalDefOutput").value;
		if(isValidDefContent(content))
		{
			var hiddenInput = document.createElement('input');
			var defId = defName + "_Def";
			hiddenInput.setAttribute('type', 'hidden');
			hiddenInput.setAttribute('id', defId);
			hiddenInput.setAttribute('value', content);
			parent.appendChild(hiddenInput);
			$("#sel_chosenDef").append(optionOpen + defName + optionClosed);
			alert("Definition file " + defName + " was added successfully.\n" +
				  "These definitions will now be available in the list of selectable definition options.");
		}
	}
}

function toggleDefNumSource(num)
{
	var fe7 = document.defMakerForm.rd_useExistingFE7Def;
	var defNum = document.defMakerForm.rd_useDefNumber;
	if(num == 1)
	{
		uncheck(fe7);
		document.defMakerForm.sel_origDef.disabled = "disabled";
		defNum.checked = "checked";
		document.defMakerForm.txt_customDefNumber.disabled = "";
	}
	else if(num == 0)
	{
		fe7.checked = "checked";
		document.defMakerForm.sel_origDef.disabled = "";
		uncheck(defNum);
		document.defMakerForm.txt_customDefNumber.disabled = "disabled";
	}
}

function saveDefOutput()
{
	var header = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> </head> <body> <div id="info">';
	var footer = '</div> </body> </html>';
	var title = "//TITLE\n" + document.topForm.chapterTitle.value + "\n\n";
	var mapLink = document.myCustomMapForm.hiddenMap.value;
	var map = "//MAP\n" + mapLink.replace("\n","") + "\n\n//TURN\n";
	var turnNum = document.topForm.turnNumber.value;
	var turn = turnNum + "\n\n//CHARACTERS\n";
	var content = "";
	$("#unitBlockDiv > div").each(function()
	{
		content += "UNITENTRY " + this.innerHTML + "\n";
	});
	document.getElementById("txa_finalOutput").value = header + "\n\n" + title + map + turn + content + "UNITENTRY End\n" + footer;
}

function resetNextCondEvent(selectId,type)
{
	$('#third' + type + 'Tier > *').each(function() 
	{
		this.style.display = "none";
	});
	
	if(selectId == ("sel_gen" + type))
	{
		$('#second' + type + 'Tier > *').each(function() 
		{
			this.style.display = "none";
		});
	}
	
	if(type == "Event")
		resetAllEventForms();
}

function getNextEvent(selectId)
{
	var subId, selected;
	if(selectId == "sel_genEvent")
	{
		resetNextCondEvent(selectId,"Event");
		var form = document.eventAdderForm;
		var choice = getSelectedOption(form.sel_genEvent);
		subId = "sel_" + choice.toLowerCase().match(/[A-Za-z]+/) + "Event";
		selected = document.getElementById(subId);
		getNextEvent(subId);
		selected.style.display = "inline";
	}
	else
	{
		var choice = getSelectedOption(document.getElementById(selectId));
		var section = choice.toLowerCase().match(/[A-Za-z_]+/);
		setEventForm(section);
	}
}

/*
function setEventForm(selector)
{
	resetNextCondEvent("","Event");
	var divId = selector + "EventDiv";
	var selectedDiv = document.getElementById(divId);
	if(selectedDiv !== undefined && selectedDiv !== null)
	{
		document.getElementById("lb_thirdEventTier").style.display = "inline";
		selectedDiv.style.display = "inline";
		setRequiredInfo(selector);
	}
	else
	{
		document.getElementById("hd_selectedEventForm").value = selector;
		document.getElementById("GenPointer").style.display = "inline";
		document.getElementById("CAMPointer").style.display = "none";
		showGenericEntries(selector);
	}	
}

function getNextCondition(selectId)
{
	resetNextCondEvent(selectId,"Cond");
	document.getElementById("eventIdForConditionsDiv").style.display = "inline";
	var choice;
	if(selectId == "sel_genCond")
	{
		var form = document.conditionForm;
		choice = "" + getSelectedOption(form.sel_genCond).match(/[A-Za-z_]+/);
		choice = choice.toLowerCase();
		var subId = "sel_" + choice + "Cond";
		var divId = choice + "CondDiv";
		var selected = document.getElementById(divId);
		if(document.getElementById(subId) !== null && document.getElementById(subId) !== undefined)
			getNextCondition(subId);
		else
		{
			document.getElementById("hd_selectedCondForm").value = choice;
		}
		selected.style.display = "inline";
	}
	else
	{
		choice = "" + getSelectedOption(document.getElementById(selectId)).match(/[A-Za-z_]+/);
		choice = choice.toLowerCase();
		var divId = choice + "CondDiv";
		var selectedDiv = document.getElementById(divId);
		if(selectedDiv !== undefined && selectedDiv !== null)
		{
			selectedDiv.style.display = "inline";
			document.getElementById("hd_selectedCondForm").value = choice;
		}
		if(choice == "door" || choice == "chest" || choice == "throne")
		{
			document.getElementById("attachEventDiv").style.display = "inline";
			document.conditionForm.ckb_eventAttached.checked = "";
			document.getElementById("eventIdForConditionsDiv").style.display = "none";
		}
		else if(choice == "shops" || choice == "fire" || choice == "poison" || 
				choice == "ballistae")
		{
			document.getElementById("eventIdForConditionsDiv").style.display = "none";
		}
	}
}
*/
/*
function updateEventOutput()
{
	var eventTableId = getSelectedOption(document.topOutputForm.sel_chosenChapter).match(/0x[0-9A-Z][0-9A-Z]/);
	var startOffset = document.topOutputForm.txt_startOffset.value;
	var goodUnitId = getBlockIdByName("Good","Unit");
	var goodUnitBlock = (goodUnitId !== null && goodUnitId !== undefined)?
						(getEventCodeOfUnitBlock(goodUnitId)):("Good:\nUNIT\n");
	var badUnitId = getBlockIdByName("Bad","Unit");
	var badUnitBlock = (badUnitId !== null && badUnitId !== undefined)?
						(getEventCodeOfUnitBlock(badUnitId)):("Bad:\nUNIT\n");
	
	document.getElementById("txa_eventOutput").value = 
	"#define DISABLE_TUTORIALS\n#include EAstdlib.event\n\n" +
	"EventPointerTable(" + eventTableId + ",Pointers)\n\n" +
	"ORG " + startOffset + "\n\n" +
	"Pointers:\nPOIN Turn_events\nPOIN Character_events\n" +
	"POIN Location_events\nPOIN Misc_events\n" +
	"POIN TrapData TrapData\nPOIN Bad Bad Bad Bad\n" +
	"POIN Good Good Good Good\nPOIN Opening_event Ending_event\n\n" +
	goodUnitBlock + badUnitBlock +
	getEventCodeOfConditionBlocks() +
	getEventCodeOfEventBlock(getBlockIdByName("Opening_event","Event")) +
	getEventCodeOfEventBlock(getBlockIdByName("Ending_event","Event")) +
	getEventCode("Event") + "\n" +
	getEventCode("ManualMove") + "\n" +
	getEventCode("ScriptedFight") + "\n" +
	getEventCode("Unit") + "\n" +
	getEventCodeOfShops() + "\n" +
	"MESSAGE Events end at offset currentOffset";
}


function toggleTurnInputForm(num)
{
	if(num == 0)
	{
		uncheck(document.conditionForm.rd_rangeTurn);
		document.getElementById("singleTurnDiv").style.display = "inline";
		document.getElementById("rangeTurnDiv").style.display = "none";
	}
	else if(num == 1)
	{
		uncheck(document.conditionForm.rd_singleTurn);
		document.getElementById("singleTurnDiv").style.display = "none";
		document.getElementById("rangeTurnDiv").style.display = "inline";
	}
}
*/

/* Sets all generic event form components invisible,
 * and also resets all form labels to default values.
 */
 /*
function resetAllEventForms()
{
	$('#genericEventEntryDiv > *').each(function() 
	{
		this.style.display = "none";
	});
	$('#genericEventEntryDiv span').each(function()
	{
		var idName = this.id;
		var raw_name = "" + idName.match(/[a-zA-Z_0-9]+?(?=Entry)/);
		var name = raw_name.replace("lb_","").replace("_"," ");
		this.innerHTML = capitalizeFirstLetter(name) + ":";
	});
	$('#genericEventEntryDiv input').each(function()
	{
		if(this.type == "checkbox")
			this.checked = "";
	});
	document.eventAdderForm.rd_characterEntry.style.display = "none";
	document.eventAdderForm.rd_posEntry.style.display = "none";
	document.eventAdderForm.ckb_timeEntry.style.display = "none";
}

/* lja;glska;jgk, why is my logic so convoluted.
 * I'll get to commenting this later.
 */
 /*
function setRequiredInfo(type)
{
	document.getElementById("GenPointer").style.display = "inline";
	document.getElementById("CAMPointer").style.display = "none";
	if(type == "status")
		document.getElementById('lb_thirdEventTier').style.display = 'none';
	var form = document.getElementById("sel_" + type + "Type");
	if(form === null || form === undefined)
		document.getElementById("hd_selectedEventForm").value = type;
	else
	{
		var choice = getSelectedOption(form).toLowerCase().match(/[a-z_]+/);
		showGenericEntries(choice);
	}
}

function showCharacterOrPositionOption(descript,charLabel,posLabel)
{
	var character = document.getElementById("characterEntryDiv");
	var pos = document.getElementById("posEntryDiv");
	var rd_character = document.eventAdderForm.rd_characterEntry;
	var rd_pos = document.eventAdderForm.rd_posEntry;
	var charOrPos = document.getElementById("lb_charOrPos");
	
	character.style.display = "inline";
	pos.style.display = "inline";
	rd_character.style.display = "inline";
	rd_pos.style.display = "inline";

	document.getElementById("lb_characterEntry").innerHTML = charLabel;
	document.getElementById("lb_positionEntry").innerHTML = posLabel;

	if(descript != "")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = descript;
	}
}
*/

/* Makes the necessary generic event form components
 * for the specified event action (choice) visible.
 * Some form labels are also changed to better
 * describe the specified event action.
 
function showGenericEntries(choice)
{
	document.getElementById("genericEventEntryDiv").style.display = "inline";	
	resetAllEventForms();
	setSelectedPosIds('txt_xPosEntry','txt_yPosEntry');
	
	var block = document.getElementById("unitBlockEntryDiv");
	var multiBlock = document.getElementById("multiUnitBlockEntryDiv");
	var character = document.getElementById("characterEntryDiv");
	var character2 = document.getElementById("character2EntryDiv");
	var side = document.getElementById("sideEntryDiv");
	var rd_character = document.eventAdderForm.rd_characterEntry;
	var rd_pos = document.eventAdderForm.rd_posEntry;
	var charOrPos = document.getElementById("lb_charOrPos");
	var pos = document.getElementById("posEntryDiv");
	var textboxPos = document.getElementById("textboxPosEntryDiv");
	var endPos = document.getElementById("endPosEntryDiv");
	var customMove = document.getElementById("customMoveEntryDiv");
	var time = document.getElementById("timeEntryDiv");
	var ckb_time = document.eventAdderForm.ckb_timeEntry;
	var fadeStyle = document.getElementById("fadeStyleEntryDiv");
	var fadeColor = document.getElementById("fadeColorEntryDiv");
	var music = document.getElementById("musicEntryDiv");
	var openText = document.getElementById("openTextEntryDiv");
	var openText2 = document.getElementById("openTextEntry2Div");
	var background = document.getElementById("backgroundEntryDiv");
	var ckb_background = document.eventAdderForm.ckb_backgroundEntry;
	var pause = document.getElementById("pauseUntilFinishedDiv");
	var removeAll = document.getElementById("removeTextDiv");
	var moreText = document.getElementById("addMoreTextDiv");
	var eventId = document.getElementById("eventIdEntryDiv");
	var eventBlock = document.getElementById("eventBlocksEntryDiv");
	var chapterId = document.getElementById("chapterIdEntryDiv");
	var radio = document.getElementById("genericRadioOptionsDiv");
	var genericCheckbox = document.getElementById("genericCheckboxDiv");
	var ai = document.getElementById("aiEntryDiv");
	var item = document.getElementById("itemEntryDiv");
	document.getElementById("hd_selectedEventForm").value = choice;
	
	if(choice == "load_unit")
	{
		multiBlock.style.display = "inline";
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "flicker_in")
	{
		block.style.display = "inline";
		character.style.display = "inline";
		time.style.display = "inline";
		pause.style.display = "inline";
		document.getElementById("lb_unit_BlockEntry").innerHTML = "Unit Block to Load:";
		document.getElementById("lb_timeEntry").innerHTML = "Flicker Speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = faster)";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "thief" || choice == "warp_in" || choice == "assassin")
	{
		block.style.display = "inline";
		pos.style.display = "inline";
		document.getElementById("lb_unit_BlockEntry").innerHTML = "Unit Block to Load:";
		document.getElementById("lb_positionEntry").innerHTML = "Load/Start Position:";
		
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "set_visible" || choice == "set_invisible")
	{
		character.style.display = "inline";
		pause.style.display = "inline";
	}
	else if(choice == "give_to_specific_character")
	{
		character.style.display = "inline";
		item.style.display = "inline";
	}
	else if(choice == "give_to_active_character" || choice == "give_to_main_lord")
	{
		item.style.display = "inline";
	}
	else if(choice == "invisible" || choice == "grayed_out" || choice == "rescuer" || choice == "rescued")
	{
		character.style.display = "inline";
		pause.style.display = "inline";
		
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Apply Status";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Reverse Status";
	}
	else if(choice == "flicker_out")
	{
		character.style.display = "inline";
		time.style.display = "inline";
		document.getElementById("lb_timeEntry").innerHTML = "Flicker Speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML =	"(lower = faster)";	
		
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "disappear" || choice == "reappear" || choice == "kill" || 
			choice == "warp_out")
	{
		showCharacterOrPositionOption("Select by...<br>","Character:","Position of unit:");
		
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "change_ai")
	{
		showCharacterOrPositionOption("Select by...<br>","Character","Position of unit:");
		ai.style.display = "inline";
		
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "focus_view")
	{
		showCharacterOrPositionOption("","On Character:","On Map Location:");
		document.getElementById("GenPointer").style.display = "none";
		document.getElementById("CAMPointer").style.display = "inline";
		document.eventAdderForm.txt_xPosEntry.value = "7";
		document.eventAdderForm.txt_yPosEntry.value = "5";
	}
	else if(choice == "flash_cursor")
	{
		showCharacterOrPositionOption("","On Character:","On Map Location:");
		
		genericCheckbox.style.display = "inline";
		document.eventAdderForm.ckb_genericCheckbox.checked = "checked";
		document.getElementById("lb_genericCheckboxEntry").innerHTML = "Focus view on cursor";
	}
	else if(choice == "move_cursor")
	{
		pos.style.display = "inline";
		document.getElementById("lb_positionEntry").innerHTML = "To Map Location:";
	}
	else if(choice == "move_to_location")
	{
		showCharacterOrPositionOption("Select unit to move...<br>","By character:","By position of unit:");
		endPos.style.display = "inline";
		document.getElementById("lb_end_PositionEntry").innerHTML = "Move To:";
		
		ckb_time.style.display = "inline";
		time.style.display = "inline";
		document.getElementById("lb_timeEntry").innerHTML = "Moving speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = slower)";
		
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "manual_move")
	{
		showCharacterOrPositionOption("Select unit to move...<br>","By character:","By position of unit:");
		document.getElementById("manualMoveEntryDiv").style.display = "inline";

		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "reposition")
	{
		showCharacterOrPositionOption("Select unit to move...<br>","By character:","By position of unit:");
		endPos.style.display = "inline";
		document.getElementById("lb_end_PositionEntry").innerHTML = "Move To:";

		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "move_next_to_character")
	{
		character.style.display = "inline";
		character2.style.display = "inline";
		document.getElementById("lb_characterEntry").innerHTML = "Move:";
		document.getElementById("lb_character_2Entry").innerHTML = "Next to:";
		
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "replace")
	{
		showCharacterOrPositionOption("Select unit to replace...<br>","By character:","By position of unit:");
		
		block.style.display = "inline";
		character2.style.display = "inline";
		document.getElementById("lb_unit_BlockEntry").innerHTML = "Load replacement character:";
		document.getElementById("lb_character_2Entry").innerHTML = "Replacement character:";
		
		fadeColor.style.display = "inline";
		music.style.display = "inline";
		document.eventAdderForm.ckb_musicEntry.style.display = "inline";
		document.getElementById("lb_musicEntry").innerHTML = "Sound effect during transition:";
		
		time.style.display = "inline";
		document.getElementById("lb_timeEntry").innerHTML = "Transition time:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = faster)";
	}
	else if(choice == "fade")
	{
		fadeStyle.style.display = "inline";
		fadeColor.style.display = "inline";
		
		time.style.display = "inline";
		document.getElementById("lb_timeEntry").innerHTML = "Fade speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = slower)";
	}
	else if(choice == "fade_set")
	{
		fadeColor.style.display = "inline";
		time.style.display = "inline";
		document.getElementById("lb_timeEntry").innerHTML = "Fade speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = slower)";
	}
	else if(choice == "fog_of_war")
	{
		fadeColor.style.display = "inline";
		time.style.display = "inline";
		document.eventAdderForm.txt_timeEntry.value = "3";
		document.getElementById("lb_timeEntry").innerHTML = "Vision distance:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(no fog = 0)";
		document.getElementById("lb_fade_ColorEntry").innerHTML = "Fog Color:";
	}
	else if(choice == "rescue")
	{
		showCharacterOrPositionOption("Select unit to rescue...<br>","By character:","By position of unit:");
		character2.style.display = "inline";
		document.getElementById("lb_character_2Entry").innerHTML = "Rescuer:";
		
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "drop")
	{
		block.style.display = "inline";
		character.style.display = "inline";
		document.getElementById("lb_unit_BlockEntry").innerHTML = "Dropped character (unit block):";
		document.getElementById("lb_characterEntry").innerHTML = "Character dropping the unit:";

		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "change_sides")
	{
		character.style.display = "inline";
		side.style.display = "inline";
	}
	else if(choice == "scripted_fight" || choice == "uncontrolled_fight")
	{
		character.style.display = "inline";
		character2.style.display = "inline";
		document.getElementById("scriptedFightEntryDiv").style.display = "inline";
		document.getElementById("lb_characterEntry").innerHTML = "Attacker:";
		document.getElementById("lb_character_2Entry").innerHTML = "Defender:";
	}
	else if(choice == "scripted_heal")
	{
		character.style.display = "inline";
		character2.style.display = "inline";
		item.style.display = "inline";
		document.getElementById("scriptedFightEntryDiv").style.display = "inline";
		document.getElementById("lb_characterEntry").innerHTML = "Attacker:";
		document.getElementById("lb_character_2Entry").innerHTML = "Defender:";
	}
	else if(choice == "change_music")
		music.style.display = "inline";
	else if(choice == "sound")
	{
		music.style.display = "inline";
		document.getElementById("lb_musicEntry").innerHTML = "Sound Effect:";
	}
	else if(choice == "fade_out_music")
	{
		time.style.display = "inline";
		document.eventAdderForm.txt_timeEntry.value = "5";
		document.getElementById("lb_timeEntry").innerHTML = "Fade speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = faster)";
	}
	else if(choice == "time_based_stall")
	{
		time.style.display = "inline";
		document.getElementById("lb_timeEntry").innerHTML = "Stall time:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(larger values = longer stall)";
	}
	else if(choice == "give_money")
	{
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "From village";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "From cutscene";
	
		openText.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "Amount:";
		document.eventAdderForm.txt_openTextEntry.value = "1000";
	}
	else if(choice == "load_background")
	{
		background.style.display = "inline";
		fadeColor.style.display = "inline";
		time.style.display = "inline";
		document.eventAdderForm.txt_timeEntry.value = "10";
		document.getElementById("lb_timeEntry").innerHTML = "Fade Speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = slower)";
	}
	else if(choice == "default_fade_into_cg")
	{
		openText.style.display = "inline";		
		fadeColor.style.display = "inline";
		time.style.display = "inline";
		document.eventAdderForm.txt_timeEntry.value = "10";
		document.getElementById("lb_timeEntry").innerHTML = "Fade Speed:";
		document.getElementById("lb_time_DescriptionEntry").innerHTML = "(lower = slower)";	
		document.getElementById("lb_textEntry").innerHTML = "CG Number:";
		document.eventAdderForm.txt_openTextEntry.value = "25";
	}
	else if(choice == "fade_into_cg_from_background")
	{
		openText.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "CG Number:";
		document.eventAdderForm.txt_openTextEntry.value = "25";
	}
	else if(choice == "default_remove_cg")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Remove text and/or background";
	}
	else if(choice == "fade_from_cg_to_background")
		background.style.display = "inline";
	else if(choice == "fade_from_cg_to_map")
	{
		pos.style.display = "inline";
		document.getElementById("lb_positionEntry").innerHTML = "Map Position:";
	}
	else if(choice == "move_main_lord")
	{
		pos.style.display = "inline";
		document.getElementById("lb_positionEntry").innerHTML = "To Position:";
		pause.style.display = "inline";
		document.eventAdderForm.ckb_pauseUntilFinished.checked = "checked";
	}
	else if(choice == "remove_cursor")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Remove cursor from map";
	}
	else if(choice == "game_over")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Automatic game over";
	}
	else if(choice == "event_based_stall")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Add Event Pause <a href=\"javascript:alert(" + 
															"'This will pause the game until all \n" + 
															"preceding unit-based actions are completed.');\">[Info]</a>";
	}
	else if(choice == "end_game")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Ends the game";
	}
	else if(choice == "end_lyn_mode")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Ends Lyn mode";
	}
	else if(choice == "sword_slash")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Screen goes black, and white sword slash<br>" + 
															"cuts across the screen (w/ selected sound effect).<br>";
		music.style.display = "inline";
		document.getElementById("lb_musicEntry").innerHTML = "Sound Effect:";
		
		openText.style.display = "inline";
		document.eventAdderForm.ckb_openTextEntry.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "CG Number:";
		document.eventAdderForm.txt_openTextEntry.value = "25";
	}
	else if(choice == "rumble")
	{
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Start Rumble";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "End Rumble";	
	}
	else if(choice == "quintessence_effect")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Magical dark-wavy effect fills the screen.";
	}
	else if(choice == "lightning_bolt")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Lightning bolt strikes map at...<br>";
		pos.style.display = "inline";
	}
	else if(choice == "map_spells")
	{
		pos.style.display = "inline";
		document.getElementById("lb_positionEntry").innerHTML = "Occurs at position:";
		document.getElementById("spellsEntryDiv").style.display = "inline";
		document.getElementById("GenPointer").style.display = "none";
		document.getElementById("CAMPointer").style.display = "inline";
		document.eventAdderForm.txt_xPosEntry.value = "7";
		document.eventAdderForm.txt_yPosEntry.value = "5";
	}
	else if(choice == "add_text")
	{
		makeAllConvoFormsVisible();
		document.getElementById("lb_textEntry").innerHTML = "Text ID:";
	}
	else if(choice == "add_mode_based_text")
	{
		makeAllConvoFormsVisible();
		document.getElementById("lb_textEntry").innerHTML = "Text ID (if Eliwood Mode):";
		openText2.style.display = "inline";
		document.getElementById("lb_textEntry2").innerHTML = "Text ID (if Hector Mode):";
	}
	else if(choice == "add_gender_based_text")
	{
		makeAllConvoFormsVisible();
		document.getElementById("lb_textEntry").innerHTML = "Text ID (if tactician male):";
		openText2.style.display = "inline";
		document.getElementById("lb_textEntry2").innerHTML = "Text ID (if tactician female):";
	}
	else if(choice == "add_event_based_text")
	{
		makeAllConvoFormsVisible();
		eventId.style.display = "inline";
		openText2.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "Text ID (if event triggered):";
		document.getElementById("lb_textEntry2").innerHTML = "Text ID (if event not triggered):";
		document.eventAdderForm.txt_eventIdEntry.value = "0x05";
	}
	else if(choice == "add_asm_based_text")
	{
		makeAllConvoFormsVisible();
		eventId.style.display = "inline";
		openText2.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "Text ID (if ASM returns 0):";
		document.getElementById("lb_textEntry2").innerHTML = "Text ID (if ASM returns 1):";
		document.getElementById("lb_event_IdEntry").innerHTML = "ASM Offset:";
		document.eventAdderForm.txt_eventIdEntry.value = "0x7A2F1";
	}
	else if(choice == "cg_convos")
	{
		moreText.style.display = "inline";
		openText.style.display = "inline";
		removeAll.style.display = "inline";
		document.eventAdderForm.txt_openTextEntry.value = "800";
		document.getElementById("lb_textEntry").innerHTML = "Text ID:";
		document.getElementById("lb_moreTextEntry").innerHTML = "Addition to previous text";
		document.eventAdderForm.ckb_removeAllText.checked = "checked";
	}
	else if(choice == "scroll" || choice == "speech_bubble")
	{
		moreText.style.display = "inline";
		openText.style.display = "inline";
		textboxPos.style.display = "block";
		document.eventAdderForm.txt_openTextEntry.value = "800";
		document.getElementById("removeTextboxDiv").style.display = "inline";
		document.getElementById("lb_moreTextEntry").innerHTML = "Addition to previous text";
		document.getElementById("lb_moreTextEntry").innerHTML = "Automatically centered";
		document.getElementById("lb_textEntry").innerHTML = "Text ID:";
		document.eventAdderForm.ckb_removeTextbox.checked = "checked";
		updateTextboxPosEntryImage();
		
		document.getElementById("GenPointer").style.display = "none";
		document.getElementById("CAMPointer").style.display = "inline";
		document.eventAdderForm.txt_xPosEntry.value = "7";
		document.eventAdderForm.txt_yPosEntry.value = "5";
	}
	else if(choice == "small_brown_box")
	{
		openText.style.display = "inline";
		textboxPos.style.display = "block";
		document.eventAdderForm.txt_openTextEntry.value = "800";
		document.getElementById("removeTextboxDiv").style.display = "inline";
		document.getElementById("lb_moreTextEntry").innerHTML = "Automatically centered";
		document.getElementById("lb_textEntry").innerHTML = "Text ID:";
		document.eventAdderForm.ckb_removeTextbox.checked = "checked";
		updateTextboxPosEntryImage();
		
		document.getElementById("GenPointer").style.display = "none";
		document.getElementById("CAMPointer").style.display = "inline";
		document.eventAdderForm.txt_xPosEntry.value = "7";
		document.eventAdderForm.txt_yPosEntry.value = "5";
	}
	else if(choice == "remove_text")
	{
		removeAll.style.display = "inline";
		document.getElementById("removeTextboxDiv").style.display = "inline";
		document.eventAdderForm.ckb_removeAllText.checked = "checked";		
	}
	else if(choice == "load_map")
	{
		chapterId.style.display = "inline";
		pos.style.display = "inline";
		document.getElementById("lb_chapter_IdEntry").innerHTML = "Map chapter:";
		document.getElementById("lb_positionEntry").innerHTML = "Focus view on:";
		document.getElementById("GenPointer").style.display = "none";
		document.getElementById("CAMPointer").style.display = "inline";
		document.eventAdderForm.txt_xPosEntry.value = "7";
		document.eventAdderForm.txt_yPosEntry.value = "5";
	}
	else if(choice == "move_to_next_chapter")
	{
		chapterId.style.display = "inline";	
	}
	else if(choice == "default_map_change")
	{
		openText.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "Map Change Id:";
		document.eventAdderForm.txt_openTextEntry.value = "0";
		
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Apply map change";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Reverse map change";
	}
	else if(choice == "map_change_by_position")
	{
		pos.style.display = "inline";
		document.getElementById("lb_positionEntry").innerHTML = "Position of map change:";
	}
	else if(choice == "adjust_volume")
	{
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Low Volume";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Normal Volume";		
	}
	else if(choice == "stationary")
	{
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Stationary";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Automatically moves with units";	
	}
	else if(choice == "event_ids")
	{
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Trigger Event Id";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Reset Event Id";

		openText.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "Event Id:";
	}
	else if(choice == "call" || choice == "jump")
		eventBlock.style.display = "inline";
	else if(choice == "unskippable_event")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Make event unskippable with start.";		
	}
	else if(choice == "asm_routine")
	{
		openText.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "ASM Offset:";
	}
	else if(choice == "clear_all_units")
	{
		charOrPos.style.display = "inline";
		document.getElementById("lb_charOrPos").innerHTML = "Remove all units from the map.";
	}
	else if(choice == "if_event_triggered")
	{
		openText.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "Event Id:";

		genericCheckbox.style.display = "inline";
		document.eventAdderForm.ckb_genericCheckbox.checked = "";
		document.getElementById("lb_genericCheckboxEntry").innerHTML = "Add additional conditions";
		
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Event ID triggered";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Event ID not triggered";
	}
	else if(choice == "if_before_turn_x")
	{
		openText.style.display = "inline";
		document.getElementById("lb_textEntry").innerHTML = "Turn:";
		
		genericCheckbox.style.display = "inline";
		document.eventAdderForm.ckb_genericCheckbox.checked = "";
		document.getElementById("lb_genericCheckboxEntry").innerHTML = "Add additional conditions";
	}
	else if(choice == "if_character_active")
	{		
		character.style.display = "inline";
		
		genericCheckbox.style.display = "inline";
		document.eventAdderForm.ckb_genericCheckbox.checked = "";
		document.getElementById("lb_genericCheckboxEntry").innerHTML = "Add additional conditions";
		
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Character active";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Character not active";
	}
	else if(choice == "if_character_dead" || choice == "if_character_on_map")
	{
		character.style.display = "inline";
		
		genericCheckbox.style.display = "inline";
		document.eventAdderForm.ckb_genericCheckbox.checked = "";
		document.getElementById("lb_genericCheckboxEntry").innerHTML = "Add additional conditions";
	}
	else if(choice == "if_yes_chosen" || choice == "if_player_phase" || 
			choice == "if_lucky" || choice == "if_male_tactician")
	{
		radio.style.display = "inline";
		document.getElementById("lb_genericRadio1Entry").innerHTML = "Default";
		document.getElementById("lb_genericRadio2Entry").innerHTML = "Opposite";
	
		genericCheckbox.style.display = "inline";
		document.eventAdderForm.ckb_genericCheckbox.checked = "";
		document.getElementById("lb_genericCheckboxEntry").innerHTML = "Add additional conditions";
	}
	else if(choice == "if_eliwood_mode" || choice == "if_hector_mode" || choice == "if_tutorial_mode")
	{
		genericCheckbox.style.display = "inline";
		document.eventAdderForm.ckb_genericCheckbox.checked = "";
		document.getElementById("lb_genericCheckboxEntry").innerHTML = "Add additional conditions";
	}
	else if(choice == "else")
	{
	}
}

function makeAllConvoFormsVisible()
{
	var removeAll = document.getElementById("removeTextDiv");
	var moreText = document.getElementById("addMoreTextDiv");
	var background = document.getElementById("backgroundEntryDiv");
	var ckb_background = document.eventAdderForm.ckb_backgroundEntry;
	var openText = document.getElementById("openTextEntryDiv");
	
	moreText.style.display = "inline";
	openText.style.display = "inline";
	document.eventAdderForm.txt_openTextEntry.value = "800";
	document.eventAdderForm.txt_openTextEntry2.value = "801";
	ckb_background.style.display = "inline";
	background.style.display = "inline";
	removeAll.style.display = "inline";
	document.getElementById("lb_moreTextEntry").innerHTML = "Addition to previous text";
	document.eventAdderForm.ckb_removeAllText.checked = "checked";
}
*/
/*
function toggleTextBackgroundForm()
{
	var isChecked = "" + document.eventAdderForm.ckb_addMoreText.checked;
	var label = "" + document.getElementById("lb_moreTextEntry").innerHTML;
	var background = document.getElementById("backgroundEntryDiv");
	var ckb_background = document.eventAdderForm.ckb_backgroundEntry;
	var pos = document.getElementById("posEntryDiv");
	if(label == "Addition to previous text")
	{
		if(isChecked == "true")
		{
			background.style.display = "none";
			ckb_background.style.display = "none";
			ckb_background.checked = "";
		}
		else
		{
			background.style.display = "inline";
			ckb_background.style.display = "inline";
		}
	}
	else if(label == "Automatically centered")
	{
		if(isChecked == "true")
			pos.style.display = "none";
		else
			pos.style.display = "inline";
	}
}
*/
/*
function getCondEventData()
{
	var actionType = document.getElementById("hd_selectedCondForm").value;
	var retVal, eventId, pointer, parent;
	var eventIdChoice = getSelectedOption(document.getElementById("sel_eventIdSource"));
	if(eventIdChoice == "None")
		eventId = "0x0";
	else if(eventIdChoice == "Existing Id")
		eventId = getSelectedOption(document.getElementById("sel_existingEventIdsList")).match(/0x[0-9A-Fa-f][0-9A-Fa-f]?/);
	else
	{
		var name = document.getElementById("txt_newEventIdLabel").value;
		name = (name !== undefined && name !== null)?(name):("No_Name");
		eventId = (eventIdChoice == "New Temporary Id")?(popNextNewEventId(name)):(popNextPermEventId(name));
	}
	if(document.conditionForm.rd_existingEvent.checked)
		pointer = getSelectedOption(document.conditionForm.sel_eventPointer);
	else
	{
		pointer = document.conditionForm.txt_eventPointer.value;
		document.topEventForm.txt_newEventBlock.value = pointer;
		addBlock('Event');
	}
	
	var num = getNewBlockElementIdNum("condition");
	var newdiv = document.createElement('div');
	var divIdName = "condition" + num;
	newdiv.setAttribute('id',divIdName);
	
	if(actionType == "turn")
	{
		var isMultiTurn = document.conditionForm.rd_rangeTurn.checked;
		var singleTurn = document.conditionForm.txt_singleTurnInput.value;
		var startTurn = document.conditionForm.txt_startTurnInput.value;
		var amountOfTurns = document.conditionForm.txt_turnAmountInput.value;
		var turnPhase = getSelectedOption(document.conditionForm.sel_startTurn).match(/[A-Za-z]+/);
		retVal = "TurnEvent" + turnPhase + "(" + eventId + "," + pointer + ",";
		parent = document.getElementById("turn_list");
		retVal = (isMultiTurn)?(retVal + startTurn + "," + amountOfTurns + ")\n"):(retVal + singleTurn + ")\n");
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"turn\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	var x1 = document.conditionForm.txt_condXPos.value;
	var y1 = document.conditionForm.txt_condYPos.value;
	var x2 = document.conditionForm.txt_bottomXArea.value;
	var y2 = document.conditionForm.txt_bottomYArea.value;
	parent = document.getElementById("location_list");
	if(actionType == "area")
	{
		parent = document.getElementById("event_list");
		retVal = "AREA " + eventId + " " + pointer + " [";
		retVal = (document.conditionForm.ckb_sameAreaPos.checked)?
							(retVal + x1 + "," + y1 + "] [" + x1 + "," + y1 + "]\n"):
							(retVal + x1 + "," + y1 + "] [" + x2 + "," + y2 + "]\n");
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"event\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "village")
	{
		var isVillage = document.conditionForm.rd_village.checked;
		retVal = (isVillage)?("Village("):("House(");
		retVal = retVal + eventId + "," + pointer + "," + x1 + "," + y1 + ")\n";
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"location\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "shops")
	{
		var shopType = getSelectedOption(document.conditionForm.sel_typeOfShop).replace(" ", "");
		var shopData = document.conditionForm.txt_shopDataPointer.value;
		var itemList = $("#sel_itemsInShop > option:selected").map(function(){ return this.value }).get().join();
		itemList = itemList.replace(/ /g,":");
		itemList = itemList.replace(/,/g," ");
		retVal = shopType + "(" + shopData + "," + x1 + "," + y1 + ")\n";
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"location\");'>Delete</a>" +
						"<input type='hidden' id='hd_shopCode" + num + "' value='" + shopData + ":\nSHLI " + itemList + "\n'>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "door")
	{
		if(document.conditionForm.ckb_eventAttached.checked)
			retVal = "DOOR " + eventId + " " + pointer + " [" + x1 + "," + y1 + "] 0x12\n";
		else
			retVal = "Door(" + x1 + "," + y1 + ")\n";
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"location\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "chest")
	{
		var item = getSelectedOption(document.conditionForm.sel_itemFromChest).replace(" ",":");
		var money = document.getElementById("txt_moneyFromChest").value;
		var chestType = (document.conditionForm.rd_itemFromChest.checked)?("Chest(" + item + ","):("ChestMoney(" + money + ",");
		var chestType2 = (document.conditionForm.rd_itemFromChest.checked)?(item):("0x77+" + money + "*0x10000");
		if(document.conditionForm.ckb_eventAttached.checked)
			retVal = "CHES " + eventId + " " + chestType2 + " [" + x1 + "," + y1 + "] 0x14\n";
		else
			retVal = chestType + x1 + "," + y1 + ")\n";
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"location\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "throne")
	{
		if(document.conditionForm.ckb_eventAttached.checked)
			retVal = "Seize(" + eventId + "," + pointer + "," + x1 + "," + y1 + ")\n";
		else
			retVal = "Seize(" + x1 + "," + y1 + ")\n";
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"location\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "talk")
	{
		var oneWay = document.conditionForm.ckb_char1OnlyCond.checked;
		var char1 = getSelectedOption(document.getElementById("sel_char1Cond")).replace(" ", ":");
		var char2 = getSelectedOption(document.getElementById("sel_char2Cond")).replace(" ", ":");
		retVal = (oneWay)?("CharacterEvent("):("CharacterEventBothWays(");
		parent = document.getElementById("character_list");
		retVal = retVal + eventId + "," + pointer + "," + char1 + "," + char2 + ")\n";
		newdiv.innerHTML = retVal + "  // <a href='javascript:removeCondition(" + num + ",\"character\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	parent = document.getElementById("event_list");
	if(actionType == "battled")
	{
		var triggeredId = document.conditionForm.txt_battleQuoteTrigId.value;
		newdiv.innerHTML = "AFEV " + eventId + " " + pointer + " " + triggeredId + "\n" +
							"  // <a href='javascript:removeCondition(" + num + ",\"event\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "event")
	{
		var triggeredId = document.conditionForm.txt_condEventId.value;
		newdiv.innerHTML = "AFEV " + eventId + " " + pointer + " " + triggeredId + "\n" +
							"  // <a href='javascript:removeCondition(" + num + ",\"event\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "defeat_boss")
	{
		newdiv.innerHTML = "DefeatBoss(" + pointer + ")\n" +
							"  // <a href='javascript:removeCondition(" + num + ",\"event\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "defeat_all")
	{
		newdiv.innerHTML = "DefeatAll(" + pointer + ")\n" +
							"  // <a href='javascript:removeCondition(" + num + ",\"event\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	
	x1 = document.conditionForm.txt_trapXPos.value;
	y1 = document.conditionForm.txt_trapYPos.value;
	parent = document.getElementById("traps_list");
	if(actionType == "fire")
	{
		newdiv.innerHTML = "FIRE [" + x1 + "," + y1 + "] 0x0 [1,1]\n" +
							"// <a href='javascript:removeCondition(" + num + ",\"traps\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "poison")
	{
		var direction = getSelectedOption(document.conditionForm.sel_trapDirect).match(/[0-3]/);
		newdiv.innerHTML = "GAST [" + x1 + "," + y1 + "] 0x" + direction + " [1,1]\n" +
							"// <a href='javascript:removeCondition(" + num + ",\"traps\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	else if(actionType == "ballistae")
	{
		var type = getSelectedOption(document.conditionForm.sel_ballistaeType).match(/[0-9]+/);
		newdiv.innerHTML = "BLST [" + x1 + "," + y1 + "] 0x" + type + "\n" +
							"// <a href='javascript:removeCondition(" + num + ",\"traps\");'>Delete</a>";
		parent.appendChild(newdiv);
	}
	updateEventOutput();
}


function getEventCodeOfConditionBlocks()
{
	var content;
	var retCode = "Turn_events:\n";
	retCode += (document.topOutputForm.ckb_prepScreen.checked)?
				("TurnEventPlayer(0x0,EventAfterExitingPrepScreen,1)\n"):
				("TurnEventPlayer(0x0,Opening_event,1)\n");

	retCode += getEventCodeOfSpecificConditionBlock("turn_list");
	
	retCode += "Character_events:\n";
	retCode += getEventCodeOfSpecificConditionBlock("character_list");
	
	retCode += "Location_events:\n";
	retCode += getEventCodeOfSpecificConditionBlock("location_list");
	
	retCode += "Misc_events:\nCauseGameOverIfLordDies\n";
	retCode += getEventCodeOfSpecificConditionBlock("event_list");
	
	retCode += "TrapData:\n";
	retCode += getEventCodeOfSpecificConditionBlock("traps_list");
	
	return retCode;
}

function getEventCodeOfShops()
{
	var idName;
	var content = "// Shop Data\n";
	$("#location_list input").each(function()
	{
		idName = "" + this.id;
		if(idName.indexOf("hd_shopCode") == 0)
			content += getDefinitionOrHexEventCode(this.value);
	});
	
	return content;
}


function getEventCodeOfEventBlock(blockId)
{
	var retCode = "";
	var name = getBlockNameById(blockId, "Event");
	var nameId = "e_name" + blockId;
	var blockName = document.getElementById(nameId).innerHTML.split("<")[0];
	var prepScreenCheck = (name == "Opening_event" && document.topOutputForm.ckb_prepScreen.checked);
	retCode += blockName + "\n";
	idArray = getAllIdsInBlock(blockId, 'Event');
	if(idArray !== null && idArray !== undefined)
	{
		for(var k = 0; k < idArray.length; k++)
		{
			elementId = "action" + idArray[k];
			var element = "" + document.getElementById(elementId).innerHTML;
			var extraCode = "" + element.split(")")[1].split("//")[0].replace(" ","");
			retCode += getActionEventCode(idArray[k]);
			retCode += (extraCode !== undefined && extraCode !== "")?(extraCode.replace(" ","")):("");
		}
	}
	return (prepScreenCheck)?(retCode + "ENDB\n\n"):(retCode + "ENDA\n\n");
}

function getActionEventCode(actionNum)
{
	var actionId = "hd_eventCode" + actionNum;
	var code = document.getElementById(actionId).value;
	return getDefinitionOrHexEventCode(code);
}
*/

function getDefintionLists(rawCharList, rawClassList, rawSkillList, itemList)
{
	var charList = Object.keys(rawCharList);
	var classList = Object.keys(rawClassList);
	var skillList = Object.keys(rawSkillList);
	setDefinitionArray(charList.sort(),".Char");
	setDefinitionArray(classList.sort(),".Classes");
	skillArray = skillList.sort();
	skillArray.unshift("N/A");
	setDefinitionArray(skillArray,".SkillOptions");
	var itemArray = [];
	var keyArray = Object.keys(itemList);
	for(var i = 0; i < keyArray.length; i++)
	{
		itemArray.push(keyArray[i] + " (" + itemList[keyArray[i]]["Uses"] + ")");
	}
	setDefinitionArray(itemArray,".Item");
}

/* OUTDATED
function getDefinitions()
{
	var iframe_window = window.frames["Forum_Emblem_Def"];
	var raw_code = iframe_window.document.getElementById("info").innerHTML;
	var codeArray = raw_code.split(/\/\/[A-Z]+/);
	var charArray = codeArray[1].match(/[A-Za-z]+/g);
	getNicelyFormattedList(charArray.sort());
	setDefinitionArray(charArray.sort(),".Char");
	var classArray = codeArray[2].match(/[A-Za-z]+/g);
	classArray = classArray.concat(FE7ClassDefs);
	getNicelyFormattedList(classArray.sort());
	setDefinitionArray(classArray.sort(),".Classes");
	var raw_itemArray = codeArray[3].split(")");
	var itemArray = [];
	for(var i = 0; i < raw_itemArray.length-1; i++)
	{
		var splitItem1 = raw_itemArray[i].split("(");
		var itemName = splitItem1[0].replace(" ","");
		var splitItem2 = splitItem1[1].split('|');
		var descrpt = splitItem2[0];
		var type = splitItem2[2];
		var uses = splitItem2[1];
		var mt = splitItem2[3];
		var hit = splitItem2[4];
		var crit = splitItem2[5];
		var rng = splitItem2[6];
		var rank = splitItem2[7];
		itemArray.push(itemName + " (" + uses + ")");
		itemDict[itemName] = [descrpt, type, uses, mt, hit, crit, rng, rank];
	}
	setDefinitionArray(itemArray,".Item");
	var skillArray = codeArray[4].match(/([A-Za-z0-9]|_|\+)+/g);
	skillArray = skillArray.sort();
	skillArray.unshift("N/A");
	setDefinitionArray(skillArray,".SkillOptions");
}
*/

function getCharacterList(charList)
{
	var iframe_window = window.frames["Forum_Emblem_Char_List"];
	var raw_code = iframe_window.document.getElementById("info").innerHTML;
	var codeArray = raw_code.split(/\/\/[A-Z]+/);
	document.topForm.chapterTitle.value = codeArray[1].replace("\n","");
	document.myCustomMapForm.hiddenMap.value = codeArray[2].replace(" ","").replace(/\n/g,"");
	document.topForm.turnNumber.value = codeArray[3].replace("\n","");
	draw();
	var charArray = codeArray[4].split("UNITENTRY ");
	for(var i = 1; i < charArray.length-1; i++)
	{
		var rawUnitData = charArray[i].replace("\n","");
		loadUnitData(rawUnitData, false);
		addUnit(charList);
	}
	resetUnitFormToDefaultValues();
}

/*
function getDefinitionOrHexEventCode(code)
{
	var splitDefs;
	var definitions = code.match(/[A-Za-z0-9_]+\:0x[0-9A-Fa-f][0-9A-Fa-f]?/g);
	if(definitions !== null && definitions !== undefined)
	{
		for(var i = 0; i < definitions.length; i++)
		{
			splitDefs = definitions[i].split(":");
			if(document.topForm.ckb_defsInOutput.checked)
				code = code.replace(definitions[i], splitDefs[0]);
			else
				code = code.replace(definitions[i], splitDefs[1]);
		}
	}
	return code;
}


function getEventCodeOfScriptedFightBlock(blockId)
{
	var retCode = "";
	nameId = "s_name" + blockId;
	retCode += document.getElementById(nameId).innerHTML.split("<")[0] + "\n";
	idArray = getAllIdsInBlock(blockId, 'ScriptedFight');
	if(idArray !== null && idArray !== undefined)
	{
		for(var k = 0; k < idArray.length; k++)
		{
			elementId = "scriptedAttack" + idArray[k];
			var element = "" + document.getElementById(elementId).innerHTML;
			retCode += "" + element.split("//")[0].replace(" ","") + "\n"; 
		}
	}
	return retCode + "BLDT\n\n";
}

function getEventCodeOfUnitBlock(blockId)
{
	var retCode = "";
	var nameId = "b_name" + blockId;
	retCode += document.getElementById(nameId).innerHTML.split("<")[0] + "\n";
	var idArray = getAllIdsInBlock(blockId, 'Unit');
	if(idArray !== null && idArray !== undefined)
	{
		for(var k = 0; k < idArray.length; k++)
		{
			var elementId = "unit" + idArray[k];
			if(document.topForm.ckb_defsInOutput.checked)
			{
				var element = document.getElementById(elementId).innerHTML;
				retCode += element.split("//")[0] + "\n";
			}
			else
				retCode += document.getElementById("hd_" + elementId).value;
		}
	}
	return retCode + "UNIT\n\n";
}

function getEventCodeOfManualMoveBlock(blockId)
{
	var retCode = "";
	var nameId = "m_name" + blockId;
	retCode += document.getElementById(nameId).innerHTML.split("<")[0] + "\nMOMA";
	var numOfMoves = document.getElementById("manualMove" + blockId + "Id").value;
	for(var k = 1; k <= numOfMoves; k++)
	{
		elementId = "customMove" + blockId + "_" + k;
		var element = document.getElementById(elementId).innerHTML;
		retCode += " " + element.replace("<br>", "");
	}
	return retCode + "\nALIGN 4\n\n";
}
*/


function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseFirstLetter(string)
{
	return string.charAt(0).toLowerCase() + string.slice(1);
}

$.fn.isAfter = function(sel) 
{
    return this.prevAll(sel).length !== 0;
}

$.fn.isBefore = function(sel) 
{
    return this.nextAll(sel).length !== 0;
}

/*
var eventFormDictionary = {"DefMaker":["defMakerTab","customDefWrapper"], 
					  "UnitEditor":["unitEditorTab","unitEditorWrapper","mapWrapper","unitBlockDiv","unitPointerImgDiv","topForm"],
					  "EventWriter":["eventWriterTab","mapWrapper","eventWriterWrapper","topEventForm","eventPointerImgDiv","eventBlockWrapper"],
					  "ConditionWriter":["conditionWriterTab","mapWrapper","conditionForm","genEventImgDiv","condBlockDiv","eventPointerImgDiv","GenPointer"],
					  "EventOutput":["eventOutputTab","txa_eventOutput","topOutputForm","topForm"]
					  };
*/
var mapSpriteDict = {"Archer":"Archer", "Archer_F":"Archer_F", 
					 "ArcherinBallista":"ArcherinBallista", "ArcherinIronBallista":"ArcherinBallista", "ArcherinKillerBallista":"ArcherinBallista",
					 "Archsage":"Archsage",
					 "Assassin":"Assassin", "Assassin_F":"Assassin_F", "HungLeila":"Assasin_F",
					 "Bard":"Bard",
					 "Berserker":"Berserker", "Corsair":"Berserker",
					 "Bishop":"Bishop", "Bishop_F":"Bishop_F",
					 "BladeLord":"BladeLord",
					 "Blight":"Blight", "Entombed":"Blight",
					 "Brammimond":"Brammimond",
					 "Summoner":"Brammimond",
					 "Brigand":"Brigand",
					 "Barbarian":"Brigand",
					 "Cavalier":"Cavalier", "Cavalier_F":"Cavalier",
					 "Cleric":"Cleric",
					 "Civilian":"Civilian", "Civilian_2":"Civilian", "Civilian_F":"Civilian_F", "Civilian_2_F":"Civilian_F",
					 "Child":"Child", "Child_2":"Child", "Child_F":"Child_F", "Child_2_F":"Child_F",
					 "Dancer":"Dancer",
					 "DarkDruid":"DarkDruid",
					 "Druid":"Druid", "Druid_F":"Druid_F",
					 "Sorcerer":"Druid","Sorcerer_F":"Druid_F",
					 "EmptyBallista":"EmptyBallista", "EmptyIronBallista":"EmptyBallista", "EmptyKillerBallista":"EmptyBallista",
					 "FalcoKnight":"FalcoKnight",
					 "FallenIceDragon":"FallenIceDragon","FallenNinian":"FallenNinian",
					 "FallenPrince":"FallenPrince",
					 "FallenWarrior":"FallenWarrior",
					 "Fighter":"Fighter",
					 "FireDragon":"FireDragon",
					 "General":"General", "General_F":"General",
					 "GreatLord":"GreatLord",
					 "Hero":"Hero", "Hero_F":"Hero_F",
					 "Knight":"Knight", "Knight_F":"Knight",
					 "KnightLord":"KnightLord",
					 "EliwoodLord":"EliwoodLord",
					 "Lord":"EliwoodLord",
					 "HectorLord":"HectorLord",
					 "LynLord":"LynLord",
					 "Mage":"Mage", "Mage_F":"Mage_F",
					 "MagicSeal":"MagicSeal",
					 "Mercenary":"Mercenary", "Mercenary_F":"Mercenary_F",
					 "Monk":"Monk",
					 "LightMage":"Monk",
					 "Myrmidon":"Myrmidon", "Myrmidon_F":"Myrmidon_F",
					 "Nomad":"Nomad", "Nomad_F":"Nomad_F",
					 "BowKnight":"Nomad","BowKnight_F":"Nomad_F",
					 "NomadTrooper":"NomadTrooper", "NomadTrooper_F":"NomadTrooper_F",
					 "Ranger":"NomadTrooper","Ranger_F":"NomadTrooper_F",
					 "Paladin":"Paladin", "Paladin_F":"Paladin",
					 "PegasusKnight":"PegasusKnight",
					 "Peer":"Peer", "Peer_F":"Peer_F",
					 "Pirate":"Pirate",
					 "Priest":"Priest",
					 "Prince":"Prince", "Princefacingupward":"Prince",
					 "Queen":"Queen",
					 "Sage":"Sage", "Sage_F":"Sage_F", "UberSage":"Sage",
					 "Shaman":"Shaman", "Shaman_F":"Shaman_F",
					 "DarkMage":"Shaman", "DarkMage_F":"Shaman_F",
					 "Sniper":"Sniper", "Sniper_F":"Sniper_F",
					 "Soldier":"Soldier",
					 "Swordmaster":"Swordmaster", "Swordmaster_F":"Swordmaster_F",
					 "Prince_Tactician":"Tactician",
					 "Transporter":"Tent", "Tent":"Tent",
					 "Thief":"Thief", "Thief_F":"Thief_F",
					 "Troubadour":"Troubadour",
					 "TransporterHorse":"TransporterHorse",
					 "Valkyrie":"Valkyrie",
					 "Wagon":"TransporterHorse",
					 "Warrior":"Warrior",
					 "WyvernLord":"WyvernLord", "WyvernLord_F":"WyvernLord",
					 "WyvernKnight":"WyvernKnight", "WyvernKnight_F":"WyvernKnight",
					 "Zombie":"Zombie"
					 }
					 
var optionOpen = "<option>";
var optionClosed = "</option>";

// Given Definitions			

var characterDefs = ["Bob","Pete","Anna"];		

var FE7ClassDefs = ["EliwoodLord","LynLord","HectorLord","KnightLord","BladeLord","GreatLord","Mercenary","Mercenary_F","Hero","Hero_F","Myrmidon","Myrmidon_F","Swordmaster","Swordmaster_F","Fighter","Warrior","Knight","Knight_F","General","General_F","Archer","Archer_F","Sniper","Sniper_F","Monk","Cleric","Bishop","Bishop_F","Mage","Mage_F","Sage","Sage_F","Shaman","Shaman_F","Druid","Druid_F","Cavalier","Cavalier_F","Paladin","Paladin_F","Troubadour","Valkyrie","Nomad","Nomad_F","NomadTrooper","NomadTrooper_F","PegasusKnight","FalcoKnight","WyvernKnight","WyvernKnight_F","WyvernLord","WyvernLord_F","Soldier","Brigand","Pirate","Berserker","Thief","Thief_F","Assassin","Civilian","Dancer","Bard","Archsage","MagicSeal","Transporter","DarkDruid","FireDragon","Civilian_2","Civilian_2_F","Child","Brammimond","Peer","Peer_F","Prince","Queen","HungLeila","Corsair","Prince_Tactician","FallenPrince","Princefacingupward","FallenNinian","FallenIceDragon","FallenWarrior","Child_2","Child_2_F","TransporterHorse","UberSage","ArcherinBallista","ArcherinIronBallista","ArcherinKillerBallista","EmptyBallista","EmptyIronBallista","EmptyKillerBallista"];

var FE7ItemDefs = ["IronSword","SlimSword","SteelSword","SilverSword","IronBlade","SteelBlade","SilverBlade","PoisonSword","Rapier","ManiKatti","BraveSword","WoDao","KillingEdge","Armourslayer","Wyrmslayer","LightBrand","RuneSword","LanceReaver","LongSword","IronSpear","SlimSpear","SteelSpear","SilverSpear","PoisonSpear","BraveSpear","KillerLance","HorseSlayer","Javelin","Spear","AxeReaver","IronAxe","SteelAxe","SilverAxe","PoisonAxe","BraveAxe","KillerAxe","Halberd","Hammer","DevilAxe","HandAxe","Tomahawk","SwordReaver","SwordSlayer","IronBow","SteelBow","SilverBow","PoisonBow","KillerBow","BraveBow","ShortBow","Longbow","Ballista","IronBallista","KillerBallista","Fire","Thunder","Elfire","Bolting","Fimbulvetr","Forblaze","Excalibur","Lightning","Shine","Divine","Purge","Aura","Luce","Flux","Luna","Nosferatu","Eclipse","Fenrir","Gespenst","Heal","Mend","Recover","Physic","Fortify","Restore","Silence","Sleep","Berserk","Warp","Rescue","TorchStaff","Hammerne","Unlock","Barrier","DragonAxe","AngelicRobe","EnergyRing","SecretBook","Speedwings","GoddessIcon","DragonShield","Talisman","Boots","BodyRing","HerosCrest","KnightsCrest","OrionsBolt","ElysianWhip","GuidingRing","ChestKey","DoorKey","LockPick","Vulnerary","Elixir","PureWater","Antitoxin","Torch","DelphiShield","MemberCard","SilverCard","WhiteGem","BlueGem","RedGem","Gold","UberSpear","ChestKey_5","Mine","LightRune","IronRune","FillasMight","NinissGrace","ThorsIre","SetsLitany","EmblemSword","EmblemSpear","EmblemAxe","EmblemBow","Durandal","Armads","Aureola","EarthSeal","AfasDrops","HeavenSeal","EmblemSeal","FellContract","SolKatti","WolfBeil","Ereshkigal","FlameTongue","RegalBlade","RexHasta","Basilikos","Rienfleche","HeavySpear","ShortSpear","OceanSeal","3000G","5000G","WindSword"];

var FE7Skills = ['N/A', 'Astra', 'Luna', 'Sol', 'Aether', 'Paragon'];

var weaponRanks = ["--",,"E", "D", "C", "B", "A", "S"];

var itemDict = {};