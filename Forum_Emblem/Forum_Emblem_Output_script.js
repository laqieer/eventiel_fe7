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
 
$(function() {
	$( "#char_accordion" ).accordion({
	heightStyle: "content",
	collapsible: true
	});
});

/*Used to format definition lists obtained from other sources
  (Not really used in this tool, just for generating the lists)
function getNicelyFormattedList(list)
{
	var retVal = "";
	for(var i = 0; i < list.length; i++)
	{
		var name = list[i].replace(/ /g,"");
		retVal += "\"" + name + "\",";
	}
	alert(retVal);
}
*/

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
function loadMap(mapImg) 
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
	img.src = mapImg;
	// Sets all the map pointers and click positions to (0,0)
	resetMapPointerLoc();
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
function clickImg(num, itemList, charList, classList, skillList)
{
	var contents = getUnitEntry(num);
	var basicData = getBasicCharData(contents);
	var mapSpriteData = getMapSpriteData(contents);
	var charPos = getCharPosition(contents);
	var x = charPos[0];
	var y = charPos[1];
	document.mapClickPosForm.txt_mouseX.value = x;
	document.mapClickPosForm.txt_mouseY.value = y;
	var startPointer = document.getElementById("StartPointer");
	startPointer.style.left = x*16 + "px";
	startPointer.style.top = y*16 + "px";
	var contents = getUnitEntry(num);
	setBasicCharData(contents,charList,classList);
	setItemData(contents, itemList);
	setSkillData(contents,skillList);
	
	var input = document.getElementById("selectedPosInput").value;
	// Do not allow grayed units to be selected
	if(mapSpriteData[3] != "true")
	{
		if(input == "txt_selectChar")
		{
			document.getElementById("txt_unitNum").value = num;
			document.getElementById(input + "X").value = x;
			document.getElementById(input + "Y").value = y;
			document.getElementById("txt_movePosX").value = x;
			document.getElementById("txt_movePosY").value = y;
			var weaponList = getWeaponLists(num, itemList);
			updateSelectOptions(document.getElementById("sel_equippableWeapons"),weaponList[0]);
			updateSelectOptions(document.getElementById("sel_unequippableItems"), weaponList[1]);
			updateSelectOptions(document.getElementById("sel_itemsOnly"), weaponList[2]);
			updateSelectOptions(document.getElementById("sel_giveItems"), weaponList[3]);
			var rallySkills = getRallySkills(num, skillList);
			if(basicData[1] == "Dancer" || basicData[1] == "Bard")
				rallySkills.push("Dance/Play");
			updateSelectOptions(document.getElementById("sel_charSkills"), rallySkills);
			var charName = basicData[0];
			if(charName.match("Generic") != null)
				charName = "Generic " + addSpaceBeforeCaps(basicData[1].replace("_F","")) + " [" + x + "," + y + "]";
			document.getElementById("selectedCharName").innerHTML = charName;
		}
		else if(input == "txt_selectOtherChar")
		{
			document.getElementById("txt_otherUnitNum").value = num;
			document.getElementById(input + "X").value = x;
			document.getElementById(input + "Y").value = y;
			var weaponList = getWeaponLists(num, itemList);
			updateSelectOptions(document.getElementById("sel_takeItems"), weaponList[3]);
			var charName = basicData[0];
			if(charName.match("Generic") != null)
			{
				charName = "Generic " + addSpaceBeforeCaps(basicData[1].replace("_F","")) + " [" + x + "," + y + "]";
			}
			document.getElementById("selectedOtherCharName").innerHTML = charName;
		}
	}
	
}

function setSelectedPosInput(value)
{
	document.getElementById("selectedPosInput").value = value;
}


function updateActionChoice()
{
	var raw_choice = getSelectedOption(document.getElementById("sel_actionChoice"));
	var choice = raw_choice.split(" (")[0];
	$("#actionChoiceDiv > div").each(function()
	{
		if(this.id != "equippableWeaponsDiv")
			this.style.display = "none";
	});
	
	if(choice == "Attack")
	{
		document.getElementById("otherCharDiv").style.display = "";
	}
	else if(choice == "Aid")
	{
		document.getElementById("otherCharDiv").style.display = "";
		document.getElementById("unequippableItemsDiv").style.display = "";
	}
	else if(choice == "Rally")
	{
		document.getElementById("otherCharDiv").style.display = "";
		document.getElementById("charSkillsDiv").style.display = "";
	}
	else if(choice == "Use")
	{
		document.getElementById("itemsOnlyDiv").style.display = "";
	}
	else if(choice == "Rescue")
	{
		document.getElementById("otherCharDiv").style.display = "";
	}
	else if(choice == "Drop")
	{
		document.getElementById("dropCharDiv").style.display = "";
	}
	else if(choice == "Trade")
	{
		document.getElementById("otherCharDiv").style.display = "";	
		document.getElementById("tradeItemsDiv").style.display = "";
	}
}

function rightClickImage(num, itemList)
{
	if ($('img.move' + num).length)
	{
		$('img.move' + num).remove();
	}
	else
	{
		var contents = getUnitEntry(num);
		var basicData = getBasicCharData(contents);
		var move = getCharStats(contents)[8];
		var charPos = getCharPosition(contents);
		var x = charPos[0];
		var y = charPos[1];
		var side = basicData[2];
		var max_x = document.getElementById("mapCanvas").width;
		var max_y = document.getElementById("mapCanvas").height;
		max_x = max_x - 16;
		max_y = max_y - 16;
		recursiveMoveAdder(num, x, y, move, side, max_x, max_y);
	}
}

function recursiveMoveAdder(num, x, y, move, side, max_x, max_y)
{
	if(move == 0)
	{
		var moveDiv = document.getElementById('unitMoveRangeDiv');
		var newImg = document.createElement('img');
		newImg.setAttribute('style', "position:absolute; left:" + x*16 + "px;" + "top:" + y*16 + "px;");
		var className = "MoveRange move" + num;
		newImg.setAttribute('src', "Forum_Emblem/" + side + "_move.png");
		newImg.setAttribute('class', className);
		moveDiv.appendChild(newImg);
		return true;
	}
	else
	{
		for(var i = 0; i < move; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				addNewRangeSection(j, x, y, move, i, side, max_x, max_y, num);
			}
		}
		return recursiveMoveAdder(num, x, y, move-1, side, max_x, max_y);
	}
}

function addNewRangeSection(num, x, y, move, i, side, max_x, max_y, unitNum)
{
	var new_x = 0;
	var new_y = 0;
	if(num == 0)
	{
		new_x = ((parseInt(x) + parseInt(move-(i+1)))*16);
		new_y = ((parseInt(y)+parseInt(i+1))*16);
	}
	else if(num == 1)
	{
		new_x = ((parseInt(x) - parseInt(move-i))*16);
		new_y = ((parseInt(y)+ parseInt(i))*16);
	}
	else if(num == 2)
	{
		new_x = ((parseInt(x) - parseInt(move-(i+1)))*16);
		new_y = ((parseInt(y) - parseInt(i+1))*16);
	}
	else
	{
		new_x = ((parseInt(x) + parseInt(move-i))*16);
		new_y = ((parseInt(y) - parseInt(i))*16);
	}
	if(new_x <= max_x && new_y <= max_y && new_x >= 0 && new_y >= 0)
	{
		var moveDiv = document.getElementById('unitMoveRangeDiv');
		var newImg = document.createElement('img');
		newImg.setAttribute('style', "position:absolute; left:" + new_x + "px;" + "top:" + new_y + "px;");
		var className = "MoveRange move" + unitNum;
		newImg.setAttribute('src', "Forum_Emblem/" + side + "_move.png");
		newImg.setAttribute('class', className);
		newImg.setAttribute('onclick', "getMapCoord(event);");
		newImg.setAttribute('oncontextmenu',"clearAllMovementRanges(); clearSelectedInputs(); return false;");
		moveDiv.appendChild(newImg);	
	}
}

function clearSelectedInputs()
{
	document.getElementById("selectedPosInput").value = "";
	document.getElementById("moveImgPos").src = "";
	document.getElementById("moveImgPos").style.display = "none";
}

function toggleColorScheme()
{
	var charStats = document.getElementById("charStats");
	var color1 = charStats.style.background;
	var color2 = charStats.style.borderColor;
	charStats.style.background = color2;
	charStats.style.borderColor = color1;
}

function clearCode()
{
	document.getElementById("txa_outputCode").value = "";
}

function getCode()
{
	var Character = document.getElementById("selectedCharName").innerHTML;
	if(Character.match(/[0-9]+,[0-9]+/) != null)
		Character = Character.replace(/ /g,"");
		
	var OtherCharacter = document.getElementById("selectedOtherCharName").innerHTML;
	if(OtherCharacter.match(/[0-9]+,[0-9]+/) != null)
		OtherCharacter = OtherCharacter.replace(/ /g,"");
		
	var MovePos = "[" + document.getElementById("txt_movePosX").value + "," +
					document.getElementById("txt_movePosY").value + "]";
					
	var equippableWeapons = document.getElementById("sel_equippableWeapons");
	var Weapon = "";
	if(equippableWeapons.options != null && equippableWeapons.options != undefined)
		Weapon = getSelectedOption(equippableWeapons);
	else
		Weapon = "Nothing";
		
	var action = getSelectedOption(document.getElementById("sel_actionChoice"));
	action = action.split(" (")[0];
	var code = "// Move " + Character + " to " + MovePos + " and " + action + " ";
	if(action == "Attack")
	{
		code += OtherCharacter + " with " + Weapon + "\n";
		code += "ACTION " + Character + " " + MovePos + " attack " + OtherCharacter + 
				" " + Weapon + "\n";
	}
	else if(action == "Aid")
	{
		var UnequippableItem = getSelectedOption(document.getElementById("sel_unequippableItems"));
		code += OtherCharacter + " with " + UnequippableItem + " (and equip " + Weapon + ")\n";
		code += "ACTION " + Character + " " + MovePos + " aid " + OtherCharacter + " " + 
				UnequippableItem + " " + Weapon + "\n";
	}
	else if(action == "Rally")
	{
		var rallySkill = getSelectedOption(document.getElementById("sel_charSkills"));
		code += " with " + rallySkill + " (and equip " + Weapon + ")\n";
		code += "ACTION " + Character + " rally " + rallySkill + " " + Weapon + "\n";
	}
	else if(action == "Use")
	{
		var Item = getSelectedOption(document.getElementById("sel_itemsOnly"));
		code += Item + " (and equip " + Weapon + ")\n";
		code += "ACTION " + Character + " " + MovePos + " use " + Item + " " + Weapon + "\n";
	}
	else if(action == "Rescue")
	{
		code += OtherCharacter + " (and equip " + Weapon + ")\n";
		code += "ACTION " + Character + " " + MovePos + " rescue " + OtherCharacter + 
				" " + Weapon + "\n";
	}
	else if(action == "Drop")
	{
		var dropPos = getSelectedOption(document.getElementById("sel_dropPos"));
		code += " to the " + dropPos + " (and equip " + Weapon + "\n";
		code += "ACTION " + Character + " " + MovePos + " drop " + dropPos + 
				" " + Weapon + "\n";
	}
	else if(action == "Trade")
	{
		var giveItems = $("#sel_giveItems > option:selected").map(function(){ return this.value }).get().join();
		var takeItems = $("#sel_takeItems > option:selected").map(function(){ return this.value }).get().join();
		if(giveItems == undefined || giveItems == null)
			giveItems = "Nothing";
		if(takeItems == undefined || giveItems == null)
			takeItems = "Nothing";
		
		code += giveItems + " for " + takeItems + " with " + OtherCharacter + " (and equip " + Weapon + ")\n";
		code += "ACTION " + Character + " " + MovePos + " trade " + OtherCharacter + 
				" " + giveItems + " " + takeItems + " " + Weapon + "\n";
	}
	else
	{
		code += Weapon + "\n";
		code += "ACTION " + Character + " " + MovePos + " equip " + Weapon + "\n";
	}
	document.getElementById("txa_outputCode").value = code;
	clearSelectedInputs();
}

/*******
[character, u_class, side, lvl, current_hp, exp, max_hp, str, mag, skl, 
			spd, lck, def, res, move, swordRank, lanceRank, axeRank, bowRank,
			lightRank, darkRank, animaRank, staveRank, x, y, mapSprite];
******/

function setBasicCharData(contents,charList,classList)
{
	var basicData = getBasicCharData(contents);
	var mapSpriteData = getMapSpriteData(contents);
	var charStatsData = getCharStats(contents);
	var bonusStatsData = getCharStatBonuses(contents);
	var characterName = document.getElementById("charName");
	characterName.innerHTML = basicData[0];
	var charPortrait = basicData[6];
	if(basicData[0].match(/Generic /) == null)
	{
		characterName.title = charList[basicData[0]]["Bio"];
		setCharSupports(basicData[0], charList);
		if(charList[basicData[0]]["Mug"] != "" && charList[basicData[0]]["Mug"] != null)
			charPortrait = charList[basicData[0]]["Mug"];
	}
	else
	{
		characterName.title = "This unit is too generic for a bio.";
		document.getElementById("supportListHolder").innerHTML = "<div>THIS CHAR HAS NO SUPPORTS. :(</div>";
	}
	document.getElementById("charPortrait").src = charPortrait;
	
	document.getElementById("charClass").innerHTML =  addSpaceBeforeCaps(basicData[1].replace("_F",""));
	var side = basicData[2];
	var grayedOut = mapSpriteData[3];
	var charStats = document.getElementById("charStats");
	var statHeader = document.getElementById("statsHeader");
	var darkSkin = document.getElementById("darkSkinOption").checked;

	if(side == "Ally")
	{
		if(grayedOut != "true")
		{
			charStats.style.background = "#E9E9FB";
			charStats.style.borderColor = "#000099";
		}
		else
		{
			charStats.style.background = "#CFCFCF";
			charStats.style.borderColor = "#808080";
		}
	}
	else if(side == "Enemy")
	{
		charStats.style.background = "#FFEEEE";
		charStats.style.borderColor = "#990000";
	}
	else
	{
		charStats.style.background = "#D6EFDE";
		charStats.style.borderColor = "#006600";
	}
	if(darkSkin)
	{
		toggleColorScheme();
	}
	document.getElementById("charLvl").innerHTML = basicData[3];
	document.getElementById("charHp").innerHTML = basicData[4] + "/" + 
													(parseInt(charStatsData[0]) + parseInt(bonusStatsData[0]));
	var charHp = document.getElementById("charHp");
	var hpPercentage = (0.1*(basicData[4]+(0.00))/(charStatsData[0]));
	if(hpPercentage > 0.6)
	{
		charHp.style.color = "#007A29";
	}
	else if(hpPercentage > 0.3)
	{
		charHp.style.color = "#CC9900";
	}
	else
	{
		charHp.style.color = "#8A0000";
	}
	
	document.getElementById("charExp").innerHTML = basicData[5];
	document.getElementById("charStr").innerHTML = charStatsData[1];
	document.getElementById("charMag").innerHTML = charStatsData[2];
	document.getElementById("charSkl").innerHTML = charStatsData[3];
	document.getElementById("charSpd").innerHTML = charStatsData[4];
	document.getElementById("charLck").innerHTML = charStatsData[5];
	document.getElementById("charDef").innerHTML = charStatsData[6];
	document.getElementById("charRes").innerHTML = charStatsData[7];
	document.getElementById("charMove").innerHTML = charStatsData[8];
	
	setCharBonusStats(contents);
	
	setCharWeaponRank(contents);
	
	setCharBattleStats(contents);
	
	var charPortraitImg = document.getElementById("charPortrait");
	
	if(basicData[0].match(/Generic /) == null)
	{
		charPortraitImg.style.border = "1px solid";
		if(charPortraitImg.width < 80)
		{
			charPortraitImg.style.paddingLeft = "10px";
			charPortraitImg.style.paddingRight = "10px";
		}
		else
		{
			charPortraitImg.style.paddingLeft = "";
			charPortraitImg.style.paddingRight = "";
		}
		if(charPortraitImg.height < 69)
		{
			charPortraitImg.style.paddingTop = "5px";
		}
		else
		{
			charPortraitImg.style.paddingTop = "";
		}
	}
	else
		charPortraitImg.style.border = "";
}


function setCharBonusStats(contents)
{
	var bonusStatsData = getCharStatBonuses(contents);
	document.getElementById("charStr_bonus").innerHTML = bonusStatsData[1];
	document.getElementById("charMag_bonus").innerHTML = bonusStatsData[2];
	document.getElementById("charSkl_bonus").innerHTML = bonusStatsData[3];
	document.getElementById("charSpd_bonus").innerHTML = bonusStatsData[4];
	document.getElementById("charLck_bonus").innerHTML = bonusStatsData[5];
	document.getElementById("charDef_bonus").innerHTML = bonusStatsData[6];
	document.getElementById("charRes_bonus").innerHTML = bonusStatsData[7];
	document.getElementById("charMove_bonus").innerHTML = bonusStatsData[8];
	
	$('.statBonus').each(function()
	{
		var idName = this.id;
		var value = this.innerHTML;
		if(idName.match("bonus") != null)
		{
			if(value != "0" && value != "")
			{
				if(value.match("-") != null)
				{
					this.style.color = "#8A0000";
				}
				else
				{
					this.innerHTML = "+" + value;
					this.style.color = "#007A29";
				}
			}
			else
			{
				this.innerHTML = "";
			}
		}
	});
}

function setCharWeaponRank(contents)
{
	var wpnRank = getCharWeaponLevelData(contents);
	document.getElementById("swordRank").innerHTML = wpnRank[0];
	document.getElementById("lanceRank").innerHTML = wpnRank[1];
	document.getElementById("axeRank").innerHTML = wpnRank[2];
	document.getElementById("bowRank").innerHTML = wpnRank[3];
	document.getElementById("lightRank").innerHTML = wpnRank[4];
	document.getElementById("darkRank").innerHTML = wpnRank[5];
	document.getElementById("animaRank").innerHTML = wpnRank[6];
	document.getElementById("staveRank").innerHTML = wpnRank[7];
}

function setCharBattleStats(contents)
{
	var bonusStats = getCharStatBonuses(contents);
	var btlStats = getCharBattleStats(contents);
	var attack = (btlStats[0] == "--")?("--"):(parseInt(btlStats[0]) + parseInt(bonusStats[9]));
	var hit = (btlStats[1] == "--")?("--"):(parseInt(btlStats[1]) + parseInt(bonusStats[10]));
	var crit = (btlStats[2] == "--")?("--"):(parseInt(btlStats[2]) + parseInt(bonusStats[11]));
	var avoid = (btlStats[3] == "--")?("--"):(parseInt(btlStats[3]) + parseInt(bonusStats[12]));
	document.getElementById("attackStat").innerHTML = attack;
	document.getElementById("hitStat").innerHTML = hit;
	document.getElementById("critStat").innerHTML = crit;
	document.getElementById("avoidStat").innerHTML = avoid;
}

var SupportBonuses = {
	'C':'Hit: +10 Avoid: +10',
	'B':'Hit: +15, Avoid: +15, Crit: +10,<br>Crit Avoid: +10, Mt: +1, Def/Res: +1',
	'A':'Hit: +20, Avoid: +20, Crit: +15,<br>Crit Avoid: +15, Mt: +2, Def/Res: +2',
	'S':'Hit: +25 Avoid: +25 Crit: +20\nCrit Avoid: +20 Mt: +3 Def/Res: +3'
}

function setCharSupports(name, charList)
{
	var supportList = charList[name]["Supports"];
	var supportHolder = document.getElementById("supportListHolder");
	if(supportList != null && Object.keys(supportList).length > 0)
	{
		var supportCharList = Object.keys(supportList);
		var length = supportCharList.length;
		var code = "";
		for(var i = 0; i < length; i++)
		{
			var rank = supportList[supportCharList[i]];
			var bonus = SupportBonuses[rank];
			var newSupport = '<div>' + supportCharList[i] + '</div><span id="supportBonus' + i + '" class="supportBonus">' + bonus + '</span><span id="supportLevel' + i + '" class="supportLevel">' + rank + '</span><br><br><hr>';
			code += "\n" + newSupport;
		}
		supportHolder.innerHTML = code;
	}
	else
	{
		supportHolder.innerHTML = "<div>THIS CHAR HAS NO SUPPORTS. :(</div>";
	}
}

function getUnitEntry(num)
{
	var unitId = "unit" + num;
	var contents = document.getElementById(unitId).innerHTML;
	return contents.split(" ");
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

function addSpaceBeforeCaps(word)
{
	var retWord = word;
	var front = "";
	var back = word.substring(1);
	var capArray = back.match(/[A-Z]/g);
	
	if(capArray != null)
	{
		for(var i = 0; i < capArray.length; i++)
		{
			var index = retWord.indexOf(capArray[i]);
			if (index == 0)
			{
				index = retWord.substring(1).indexOf(capArray[i]) + 1;
			}
			if (retWord[index-1] == ' ')
			{
				index = retWord.substring(index+1).indexOf(capArray[i]) + retWord.substring(0,index+1).length;
			}
			front = retWord.substring(0, index);
			back = retWord.substring(index);
			retWord = front + " " + back;
		}
	}
	return retWord;
}

function getBasicCharData(cut1)
{
	// Parse raw unit code
	var character = cut1[0];
	var charPortrait = "Forum_Emblem/Unknown.png";
	var u_class = cut1[1];
	
	var side = cut1[2];
	
	var num = 0;
	if(character == "GenericChar")
	{
		character = "Generic " + side;
		var classMug = genericPortraitsDict[u_class];
		if(classMug != null)
			charPortrait = "http://www.feplanet.net/media/sprites/7/portraits/classes/" + classMug + ".gif";
		else
			charPortrait = "Forum_Emblem/SpecialClass.png";
	}
	
	var lvlHpExp = cut1[5].replace("[","").replace("]","").replace(" ","").split(",");
	var lvl = lvlHpExp[0];
	var current_hp = lvlHpExp[1];
	var exp = lvlHpExp[2];
	
	return [character, u_class, side, lvl, current_hp, exp, charPortrait];
}

function getMapSpriteData(cut1)
{
	var mapSprite = cut1[3];
	
	var shift = cut1[10].replace("[","").replace("]","").replace(" ","").split(",");
	var shiftUp = shift[0];
	var shiftLeft = shift[1];
	
	var grayedOut = cut1[12];
	
	return  [shiftUp, shiftLeft, mapSprite, grayedOut];
}

function getCharPosition(cut1)
{
	var start = cut1[4].replace("[","").replace("]","").replace(" ","").split(",");
	var x = start[0];
	var y = start[1];
	return [x, y];
}

function getCharStats(cut1)
{	
	var stats = cut1[6].replace("[","").replace("]","").replace(" ","").split(",");
	var max_hp = stats[0];
	var str = stats[1];
	var mag = stats[2];
	var skl = stats[3];
	var spd = stats[4];
	var lck = stats[5];
	var def = stats[6];
	var res = stats[7];
	var move = stats[8];
	
	return [max_hp, str, mag, skl, spd, lck, def, res, move]; 
}

function getCharStatBonuses(cut1)
{	
	var bonuses = cut1[13].replace("[","").replace("]","").replace(" ","").split(",");
	var max_hp_bonus = bonuses[0];
	var str_bonus = bonuses[1];
	var mag_bonus = bonuses[2];
	var skl_bonus = bonuses[3];
	var spd_bonus = bonuses[4];
	var lck_bonus = bonuses[5];
	var def_bonus = bonuses[6];
	var res_bonus = bonuses[7];
	var move_bonus = bonuses[8];
	var attack_bonus = bonuses[9];
	var hit_bonus = bonuses[10];
	var crit_bonus = bonuses[11];
	var avoid_bonus = bonuses[12];
	
	return [max_hp_bonus, str_bonus, mag_bonus, skl_bonus, spd_bonus, 
			lck_bonus, def_bonus, res_bonus, move_bonus, attack_bonus, 
			hit_bonus, crit_bonus, avoid_bonus]; 
}

function getCharBattleStats(cut1)
{
	var battleStats = cut1[11].replace("[","").replace("]","").replace(" ","").split(",");
	var attack = battleStats[0];
	var hit = battleStats[1];
	var crit = battleStats[2];
	var avoid = battleStats[3];
	
	return [attack, hit, crit, avoid];
}

function getCharWeaponLevelData(cut1)
{
	var weaponLvl = cut1[7].replace("[","").replace("]","").replace(" ","").split(",");
	var swordRank = weaponLvl[0];
	var lanceRank = weaponLvl[1];
	var axeRank = weaponLvl[2];
	var bowRank = weaponLvl[3];
	var lightRank = weaponLvl[4];
	var darkRank = weaponLvl[5];
	var animaRank = weaponLvl[6];
	var staveRank = weaponLvl[7];
	
	return [swordRank, lanceRank, axeRank, bowRank,
			lightRank, darkRank, animaRank, staveRank];
}

function getItemData(cut1, itemList)
{
		var items = ["No_Item"];
	if(cut1[8] != "[]")
		items = cut1[8].replace("[","").replace("]","").split(",");
	
	while(items.length < 5)
		items.push("No_Item");
	return items;
}

function getRallySkills(num, skillList)
{
	var contents = getUnitEntry(num);
	var skills = getSkillData(contents);
	var rallySkills = [];
	for(var i = 0; i < skills.length; i++)
	{
		if(skills[i].match("Rally") != null)
		{
			rallySkills.push(skills[i]);
		}
	}
	return rallySkills;
}

function getWeaponLists(num, itemList)
{	
	var contents = getUnitEntry(num);
	var items = getItemData(contents, itemList);
	var equippableWeapons = [];
	var unequippableItems = [];
	var itemsOnly = [];
	var allItems = [];
	var weaponRankList = getWeaponRankList(contents, itemList);
	
	for(var i = 0; i < 5; i++)
	{
		if(items[i] != "No_Item")
		{
			var itemCut1 = items[i].split("(");
			var itemName = itemCut1[0];
			var usesEquipped = itemCut1[1].replace(")","").split(";");
			var equipped = usesEquipped[1];
			var usesLeft = usesEquipped[0];
			
			allItems.push(itemName + "(" + usesLeft + ")");
			var itemEntry = itemList[itemName];
			var itemType = itemEntry["Type"];
			
			// If not an item
			if(itemType != "Item" && itemType != "Scroll")
			{
				// If not equippable
				if(itemType == "Staff" || weaponRankList[itemType] == "--" || 
					(weaponRankList[itemType] > itemEntry["Level"] && weaponRankList[itemType] != 'S'))
				{
					if(itemType == "Staff" && weaponRankList[itemType] !== "--" &&
						(weaponRankList["Staff"] < itemEntry["Level"] || weaponRankList["Staff"] == 'S'))
						unequippableItems.push(itemName + "(" + usesLeft + ")");
				}
				// If equippable
				else
				{
					if(equipped == "true")
						equippableWeapons.unshift(itemName + "(" + usesLeft + ")");
					else
						equippableWeapons.push(itemName + "(" + usesLeft + ")");
				}
			}
			// If an item.
			else
			{
				unequippableItems.push(itemName + "(" + usesLeft + ")");
				itemsOnly.push(itemName + "(" + usesLeft + ")");
			}
		}
	}
	return [equippableWeapons, unequippableItems, itemsOnly, allItems];
}

function getWeaponRankList(cut1, itemList)
{
	// Parse raw unit code	
	var weaponLvl = cut1[7].replace("[","").replace("]","").replace(" ","").split(",");
	var swordRank = weaponLvl[0];
	var lanceRank = weaponLvl[1];
	var axeRank = weaponLvl[2];
	var bowRank = weaponLvl[3];
	var lightRank = weaponLvl[4];
	var darkRank = weaponLvl[5];
	var animaRank = weaponLvl[6];
	var staveRank = weaponLvl[7];
	var weaponRankList = {"Sword":swordRank, "Lance":lanceRank, "Axe":axeRank, "Bow":bowRank,
						  "Light":lightRank, "Dark":darkRank, "Anima":animaRank,"Staff":staveRank};
	return weaponRankList;
}

function setItemData(contents, itemList)
{
	/*******EDIT THIS PLEASE
	Lyn LynLord MapSprites/LynLordAlly.png [0,0] [1,1,1] [1,1,1,1,1,1,1,1,1] [E,E,E,E,E,E,E] [SlimSword,SilverSword,LanceReaver,RuneSword,LightBrand] [Astra,Luna,Sol]
	
	******/
	// Parse raw unit code
	var items = getItemData(contents, itemList);
	var weaponRankList = getWeaponRankList(contents, itemList)
	
	for(var i = 0; i < 5; i++)
	{
		var id = "charItem" + (i + 1);
		var charItem = document.getElementById(id);
		var itemUses = document.getElementById("itemUses" + (i+1));
		if(items[i] != "No_Item")
		{
			var itemCut1 = items[i].split("(");
			var itemName = itemCut1[0];
			var itemEntry = itemList[itemName];
			var info = itemEntry["Descript"];
			
			var itemType = itemEntry["Type"]
			
			var usesEquipped = itemCut1[1].replace(")","").split(";");
			var equipped = "";
			charItem.style.color = "";
			itemUses.style.color = "";
			charItem.style.fontWeight = "";
			itemUses.style.fontWeight = "";
			
			if(itemType != "Item" && itemType != "Scroll")
			{
				if(usesEquipped[1] == "true")
				{
					charItem.style.fontWeight = "bold";
					itemUses.style.fontWeight = "bold";
				}
				if(weaponRankList[itemType] == "--" || (weaponRankList[itemType] > itemEntry["Level"] && weaponRankList[itemType] != 'S'))
				{
					charItem.style.fontWeight = "";
					charItem.style.color = "#A6AAAA";
					itemUses.style.fontWeight = "";
					itemUses.style.color = "#A6AAAA";
				}
				info += "\nType: " + itemEntry["Type"] +
						"     Mt: " + itemEntry["Mt"] + "     Hit: " + itemEntry["Hit"] + 
						"     Crit: " + itemEntry["Crit"] + "     Range: " + itemEntry["Range"] +
						"     Rank: " + itemEntry["Level"];
			}
			var usesLeft = usesEquipped[0];

			charItem.innerHTML = addSpaceBeforeCaps(itemName);
			itemUses.innerHTML = usesLeft + "/" + itemEntry["Uses"];

			charItem.title = info;
		}
		else
		{
			charItem.innerHTML = "-------------------";
			itemUses.innerHTML = "";
			charItem.style.color = "";
			itemUses.style.color = "";
			charItem.style.fontWeight = "";
			itemUses.style.fontWeight = "";
			charItem.title = "";
		}
	}
}

function getSkillData(cut1)
{
	var skills = ["N/A"];
	if(cut1[9] != "[]")
		skills = cut1[9].replace("[","").replace("]","").split(",");
	while(skills.length < 5)
		skills.push("N/A");
	return skills;
}

function setSkillData(contents, skillList)
{
	// Parse raw unit code
	var skills = getSkillData(contents);
	
	for(var j = 0; j < 5; j++)
	{
		var charSkill = document.getElementById("charSkill" + (j + 1));
		if(skills[j] != "N/A")
		{
			var skillName = skills[j].replace(/_/g, " ");
			charSkill.innerHTML = skillName;
			charSkill.title = skillList[skills[j]]["Descript"];
		}
		else
		{
			charSkill.innerHTML = "----------------------";
			charSkill.title = "";
		}
	}
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
	loadUnitData(contents);
	
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
 
function returnUnitData(num)
{
	var characterName = "GenericChar";
	var mapSpriteLoc = setImgPos(num);
	if(document.unitEditorForm.rd_genericSprite.checked)
		mapSpriteLoc = "GenericSprite";
	if(document.unitEditorForm.rd_existingChar.checked)
		characterName = getSelectedOption(document.unitEditorForm.sel_character);
			
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
  
  
  //var skillArray = all selected skills
  
  return characterName + " " + u_class + " " + side + " " + mapSpriteLoc + 
		' [' + x_st + ',' + y_st + ']' + ' [' + level + ',' + current_hp + ',' + exp + ']' +
		' [' + max_hp + ',' + str + ',' + mag + ',' + skl + ',' + spd + ',' + lck + ',' + def + ',' +
		res + ',' + move + ',' + con + '] [' + sword + ',' + lance + ',' + axe + ',' + bow + ',' + 
		light + ',' + dark + ',' + anima + ',' + stave + '] [' + itemArray + '] [' + skillArray + ']';
}

// Updates Item Usage
function updateItemMaxUses(num)
{
	var item = getSelectedOption(document.getElementById("sel_item" + num));
	document.getElementById("txt_item" + num + "_max_uses").innerHTML = item.split(" ")[1].match(/[0-9]+/);
}

// Edits the data of the selected unit to match what is in the Unit Editor form
function editUnit()
{
	var num = document.unitEditorForm.txt_unitNum.value;
	var unitId = "unit" + num;
	document.getElementById(unitId).innerHTML = returnUnitData(num);
	setImgPos(num);
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
	
	var input = document.getElementById("selectedPosInput").value;
	if(input == "txt_movePos")
	{
		document.getElementById(input + "X").value = mapX;
		document.getElementById(input + "Y").value = mapY;
		var moveImg = document.getElementById("moveImgPos");
		var unitNum = document.getElementById("txt_unitNum").value;
		var shift = getMapSpriteData(getUnitEntry(unitNum));
		var shiftUp = shift[0];
		var shiftLeft = shift[1];
		moveImg.style.display = "";
		moveImg.style.left = (mapX*16 - shiftLeft) + "px";
		moveImg.style.top = (mapY*16 - shiftUp) + "px";
		moveImg.src = document.getElementById('my'+unitNum+'Img').src;
	}
}

function clearAllMovementRanges()
{
	$('.MoveRange').remove();
}


function toggleStatDisplay()
{
	if (document.getElementById("weaponList").style.display != "none")
	{
		$('.statBody').each(function()
		{
			this.style.display = "none";
		});
		document.getElementById("supportListHolder").style.display = "";
	}
}

function toggleSupportDisplay()
{
	if (document.getElementById("supportListHolder").style.display != "none")
	{
		document.getElementById("supportListHolder").style.display = "none";	
		$('.statBody').each(function()
		{
			this.style.display = "";
		});
	}
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
function addUnit(contents, charList)
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
	imgClick = "clickImg(" + num + ", F_E_getItemList(), F_E_getCharList(), F_E_getClassList(), F_E_getSkillList());";
	rightClickImg = "rightClickImage(" + num + ", F_E_getItemList()); return false;";
	newImg.setAttribute('onclick', imgClick);
	newImg.setAttribute('oncontextmenu', rightClickImg);
	mapDiv.appendChild(newImg);
	
	newdiv.innerHTML = contents;
	setImgPos(num, contents, charList);
	parent.appendChild(newdiv);
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

function setImgPos(num, raw_contents, charList)
{
  var contents = raw_contents.split(" ");
  var basicData = getBasicCharData(contents);
  var mapSpriteData = getMapSpriteData(contents);
  var charPos = getCharPosition(contents);
  var charName = basicData[0];
    var u_class = basicData[1];
  var side = basicData[2];
  var x_st = charPos[0];
  var y_st = charPos[1];
  var shiftUp = mapSpriteData[0];
  var shiftLeft = mapSpriteData[1];
  var sprite = mapSpriteData[2];
  var grayedOut = mapSpriteData[3];
  
  var imgid = "my" + num + "Img";
  var img = document.getElementById(imgid);
  var imgUrl = sprite;
  
  if(sprite == "GenericSprite")
  {
	  var imgClass;
	  if(mapSpriteDict[u_class] !== undefined)
	  {
		imgClass = mapSpriteDict[u_class];
	  }
	  else
		imgClass = "Generic";
	  imgUrl = "MapSprites/" + imgClass + side + ".png";
  }
  else if(sprite == "CharacterSprite")
  {
		var charSprite = charList[charName]["MapSprite"];
		if(charSprite != null && charSprite != undefined && charSprite != "")
		{
			imgUrl = charSprite;
		}
  }
  
  img.src = imgUrl;
  img.style.position = "absolute";
  img.style.left = (x_st*16)-shiftLeft + "px";
  img.style.top = (y_st*16)-shiftUp + "px";
  
  if(grayedOut == "true")
  {
	img.className = "grayScale";
  }
  else
	img.className = "";
  
  return imgUrl;
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

function toggleInvisibleUnits(num)
{
	var visId = "visImg" + num;
	var imgSrc = document.getElementById(visId).src;
	var isVisible = (imgSrc.indexOf("Invisible") >= 0);
	var visibility = (isVisible)?("Visible"):("Invisible");
	changeVisibilityOfUnitBlock(num,isVisible);
	document.getElementById(visId).src = "BlockIcons/" + visibility + ".png";
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
	var map = "//MAP\n" + document.myCustomMapForm.hiddenMap.value + "\n//CHARACTERS\n";
	var content = "";
	$("#unitBlockDiv > div").each(function()
	{
		content += "UNITENTRY " + this.innerHTML + "\n";
	});
	document.getElementById("txa_finalOutput").value = header + "\n\n" + title + map + content + "UNITENTRY End\n\n" + footer;
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

function getDefinitions()
{
	var iframe_window = window.frames["Forum_Emblem_Def"];
	var raw_code = iframe_window.document.getElementById("info").innerHTML;
	var codeArray = raw_code.split(/\/\/[A-Z]+/);
	var charArray = codeArray[1].match(/[A-Za-z]+/g);
	setDefinitionArray(charArray.sort(),".Char");
	var classArray = codeArray[2].match(/[A-Za-z]+/g);
	classArray = classArray.concat(FE7ClassDefs);
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

function getCharacterList(charList)
{
	var iframe_window = window.frames["Forum_Emblem_Char_List"];
	var raw_code = iframe_window.document.getElementById("info").innerHTML;
	var codeArray = raw_code.split(/\/\/[A-Z]+/);
	var chaptTitle = document.getElementById("chapterTitle");
	chapterTitle.innerHTML = codeArray[1];
	var mapImg = codeArray[2].replace(" ", "").replace(/\n/g,"");
	loadMap(mapImg);
	document.getElementById("turnNumber").innerHTML = codeArray[3].replace(/\n/g,"");
	var charArray = codeArray[4].split("UNITENTRY ");
	for(var i = 1; i < charArray.length-1; i++)
	{
		var rawCharData = charArray[i].replace("\n","");
		addUnit(rawCharData, charList);
	}
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


var genericPortraitsDict = {"Archer":"archer", "Archer_F":"archer", 
					 "ArcherinBallista":"archer", "ArcherinIronBallista":"archer", "ArcherinKillerBallista":"archer",
					 "Archsage":"sage",
					 "Assassin":"rogue", "Assassin_F":"rogue", "HungLeila":"rogue",
					 "Berserker":"berserker", "Corsair":"berserker",
					 "Bishop":"bishop", "Bishop_F":"bishop",
					 "BladeLord":"swordmaster",
					 "Blight":"entombed", "Entombed":"entombed",
					 "Brigand":"brigand",
					 "Cavalier":"cavalier", "Cavalier_F":"cavalier",
					 "Cleric":"priest",
					 "DarkDruid":"druid",
					 "Druid":"druid", "Druid_F":"druid",
					 "FalcoKnight":"falcoknight",
					 "Fighter":"fighter",
					 "FireDragon":"manakete",
					 "General":"general", "General_F":"general",
					 "Hero":"hero", "Hero_F":"hero",
					 "Knight":"knight", "Knight_F":"knight",
					 "Mage":"mage", "Mage_F":"mage",
					 "Mercenary":"mercenary", "Mercenary_F":"mercenary",
					 "Monk":"priest",
					 "Myrmidon":"myrmidon", "Myrmidon_F":"myrmidon",
					 "Nomad":"nomad", "Nomad_F":"nomad",
					 "NomadTrooper":"nomad_trooper", "NomadTrooper_F":"nomad_trooper",
					 "Paladin":"paladin", "Paladin_F":"paladin",
					 "PegasusKnight":"pegasus_knight",
					 "Pirate":"pirate",
					 "Priest":"priest",
					 "Sage":"sage", "Sage_F":"sage", "UberSage":"sage",
					 "Shaman":"shaman", "Shaman_F":"shaman",
					 "Sniper":"sniper", "Sniper_F":"sniper",
					 "Soldier":"soldier",
					 "Swordmaster":"swordmaster", "Swordmaster_F":"swordmaster",
					 "Thief":"thief", "Thief_F":"thief_F",
					 "Troubadour":"troubadour",
					 "Valkyrie":"valkyrie",
					 "Warrior":"warrior",
					 "WyvernLord":"wyvern_lord", "WyvernLord_F":"wyvern_lord",
					 "WyvernKnight":"wyvern_rider", "WyvernKnight_F":"wyvern_rider",
					 "Zombie":"revenant"
}

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

var FE7ClassDefs = ["EliwoodLord","LynLord","HectorLord","KnightLord","BladeLord","GreatLord","Mercenary","Mercenary_F","Hero","Hero_F","Myrmidon","Myrmidon_F","Swordmaster","Swordmaster_F","Fighter","Warrior","Knight","Knight_F","General","General_F","Archer","Archer_F","Sniper","Sniper_F","Monk","Cleric","Bishop","Bishop_F","Mage","Mage_F","Sage","Sage_F","Shaman","Shaman_F","Druid","Druid_F","Cavalier","Cavalier_F","Paladin","Paladin_F","Troubadour","Valkyrie","Nomad","Nomad_F","NomadTrooper","NomadTrooper_F","PegasusKnight","FalcoKnight","WyvernKnight","WyvernKnight_F","WyvernLord","WyvernLord_F","Soldier","Brigand","Pirate","Berserker","Thief","Thief_F","Assassin","Civilian","Dancer","Bard","Archsage","MagicSeal","Transporter","DarkDruid","FireDragon","Civilian_2","Civilian_2_F","Child","Brammimond","Peer","Peer_F","Prince","Queen","HungLeila","Corsair","Prince_Tactician","FallenPrince","Princefacingupward","FallenNinian","FallenIceDragon","FallenWarrior","Child_2","Child_2_F","TransporterHorse","UberSage","ArcherinBallista","ArcherinIronBallista","ArcherinKillerBallista","EmptyBallista","EmptyIronBallista","EmptyKillerBallista"];

var FE7ItemDefs = ["IronSword","SlimSword","SteelSword","SilverSword","IronBlade","SteelBlade","SilverBlade","PoisonSword","Rapier","ManiKatti","BraveSword","WoDao","KillingEdge","Armourslayer","Wyrmslayer","LightBrand","RuneSword","LanceReaver","LongSword","IronSpear","SlimSpear","SteelSpear","SilverSpear","PoisonSpear","BraveSpear","KillerLance","HorseSlayer","Javelin","Spear","AxeReaver","IronAxe","SteelAxe","SilverAxe","PoisonAxe","BraveAxe","KillerAxe","Halberd","Hammer","DevilAxe","HandAxe","Tomahawk","SwordReaver","SwordSlayer","IronBow","SteelBow","SilverBow","PoisonBow","KillerBow","BraveBow","ShortBow","Longbow","Ballista","IronBallista","KillerBallista","Fire","Thunder","Elfire","Bolting","Fimbulvetr","Forblaze","Excalibur","Lightning","Shine","Divine","Purge","Aura","Luce","Flux","Luna","Nosferatu","Eclipse","Fenrir","Gespenst","Heal","Mend","Recover","Physic","Fortify","Restore","Silence","Sleep","Berserk","Warp","Rescue","TorchStaff","Hammerne","Unlock","Barrier","DragonAxe","AngelicRobe","EnergyRing","SecretBook","Speedwings","GoddessIcon","DragonShield","Talisman","Boots","BodyRing","HerosCrest","KnightsCrest","OrionsBolt","ElysianWhip","GuidingRing","ChestKey","DoorKey","LockPick","Vulnerary","Elixir","PureWater","Antitoxin","Torch","DelphiShield","MemberCard","SilverCard","WhiteGem","BlueGem","RedGem","Gold","UberSpear","ChestKey_5","Mine","LightRune","IronRune","FillasMight","NinissGrace","ThorsIre","SetsLitany","EmblemSword","EmblemSpear","EmblemAxe","EmblemBow","Durandal","Armads","Aureola","EarthSeal","AfasDrops","HeavenSeal","EmblemSeal","FellContract","SolKatti","WolfBeil","Ereshkigal","FlameTongue","RegalBlade","RexHasta","Basilikos","Rienfleche","HeavySpear","ShortSpear","OceanSeal","3000G","5000G","WindSword"];

var weaponRanks = ["--","E", "D", "C", "B", "A", "S"];
