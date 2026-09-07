(function () {
	"use strict";

	const STORAGE_KEY = "caughtFishLS-combined";
	const ACTIVE_TAB_KEY = "checklistCombined-activeTab";
	const ROUTES = [{ id: "ruby" }, { id: "indigo" }];

	let routeFish = {
		ruby: [],
		indigo: [],
	};
	let routeTableIds = {
		ruby: [],
		indigo: [],
	};
	let dataReady = false;
	let translationsReady = false;
	let checkboxEventsBound = false;
	let tabStateBound = false;
	let dataTableOrderRegistered = false;

	let state = loadState();

	$(document).one("translationsLoaded", function () {
		translationsReady = true;
		tryRenderChecklist();
	});

	document.addEventListener("DOMContentLoaded", init);

	async function init() {
		const throbber = document.getElementById("checklistThrobber");
		const lang = getChecklistLanguage();
		translationsReady = isTranslationsReady();

		try {
			const results = await Promise.all(
				ROUTES.map((route) => loadRouteFish(route.id, lang))
			);

			results.forEach((list, index) => {
				routeFish[ROUTES[index].id] = list;
			});
			dataReady = true;
			tryRenderChecklist();

			if (typeof ContentReady !== "undefined") {
				ContentReady.sheetDataLoaded();
			}
		} catch (error) {
			console.error("Failed to load checklist data:", error);
			showLoadError();
			if (typeof ContentReady !== "undefined") {
				ContentReady.sheetDataLoaded();
			}
		} finally {
			if (throbber) {
				throbber.classList.add("d-none");
			}
		}
	}

	function isTranslationsReady() {
		return (
			typeof translateWord === "function" &&
			translateWord("table.fish") !== "table.fish"
		);
	}

	function tryRenderChecklist() {
		if (!dataReady) {
			return;
		}
		if (!translationsReady && !isTranslationsReady()) {
			return;
		}

		renderRoute("ruby");
		renderRoute("indigo");
		initSortableTable("ruby");
		initSortableTable("indigo");

		if (!checkboxEventsBound) {
			bindCheckboxEvents();
			checkboxEventsBound = true;
		}
		if (!tabStateBound) {
			bindTabState();
			bindImportExport();
			tabStateBound = true;
		}

		restoreActiveTab();
		initTooltips();
        applyChecklistFilters();
	}

	async function loadRouteFish(routeId, lang) {
		const localizedPath =
			"../fishdata/" + routeId + "-" + lang.toUpperCase() + ".csv";
		let response = await fetch(localizedPath, { cache: "no-store" });

		if (!response.ok && lang !== "en") {
			response = await fetch("../fishdata/" + routeId + "-EN.csv", {
				cache: "no-store",
			});
		}

		if (!response.ok) {
			throw new Error(
				"Could not load fish CSV for " + routeId + ": " + response.status
			);
		}

		const csvText = await response.text();
		const rows = parseCsv(csvText);
		const uniqueFish = [];
		const seen = new Set();

		rows.forEach((row) => {
			const rawFish = (row.Fish || "").trim();
			if (!rawFish) {
				return;
			}

			const fishKey = normalizeFishName(rawFish);
			if (!fishKey) {
				return;
			}
			const stateKey = buildFishEntryStateKey(row, fishKey);
			if (seen.has(stateKey)) {
				return;
			}
			const displayFishName = normalizeFishName(
				(row.FishTranslated || row.Fish || "").trim()
			);
			const bestBaitRaw = (row.BestBait || "").trim();
			const bestBaitTranslatedRaw = window.OceanCollection.baitInfo(row).label;
			const biteTimeRaw = getBiteTimeForBestBait(row, bestBaitRaw);

			seen.add(stateKey);
			uniqueFish.push({
				name: fishKey,
				stateKey: stateKey,
				displayName: displayFishName || fishKey,
				fishImageName: fishKey.replace(/'/g, "_"),
				bestBait: bestBaitRaw,
				bestBaitTranslated: bestBaitTranslatedRaw,
				biteTime: biteTimeRaw,
				timeFrameDay: (row.TimeFrameDay || "").trim(),
				timeFrameNight: (row.TimeFrameNight || "").trim(),
				timeFrameSunset: (row.TimeFrameSunset || "").trim(),
				stopId: (row.Stop || row.StopTranslated || "").trim(),
				stop: getFishingStopLabel(row.Stop, row.StopTranslated),
				route: routeId,
				stars: (row.Stars || "").trim(),
				hookset: (row.Hookset || "").trim(),
				hooksetName: (row.hooksetName || row.Hookset || "").trim(),
				bite: (row.Bite || "").trim(),
				points: (row.Points || "").trim(),
				dh: (row.DH || "").trim(),
				th: (row.TH || "").trim(),
				mission: (row.Mission || "").trim(),
				species: (row.Species || "").trim(),
				speciesTranslated: (row.SpeciesTranslated || row.Species || "").trim(),
				intuition: (row.Intuition || "").trim(),
				dataNotes: row.DataNotes || "",
				weather: {
					clearSkies: (row.WeatherClearSkies || "").trim(),
					clouds: (row.WeatherClouds || "").trim(),
					fairSkies: (row.WeatherFairSkies || "").trim(),
					fog: (row.WeatherFog || "").trim(),
					special1: (row.WeatherSpecial1 || "").trim(),
					special1Type: (row.WeatherSpecial1Type || "").trim(),
					special1TypeTranslated: (row.WeatherSpecial1TypeTranslated || row.WeatherSpecial1Type || "").trim(),
					special2: (row.WeatherSpecial2 || "").trim(),
					special2Type: (row.WeatherSpecial2Type || "").trim(),
					special2TypeTranslated: (row.WeatherSpecial2TypeTranslated || row.WeatherSpecial2Type || "").trim(),
					special3: (row.WeatherSpecial3 || "").trim(),
					special3Type: (row.WeatherSpecial3Type || "").trim(),
					special3TypeTranslated: (row.WeatherSpecial3TypeTranslated || row.WeatherSpecial3Type || "").trim(),
				},
			});

		});

		return uniqueFish;
	}

	function normalizeFishName(rawName) {
		return rawName.replace(/^(?:[MITF]!)+/, "").trim();
	}

	function buildFishEntryStateKey(row, fishKey) {
		const stop = ((row.Stop || row.StopTranslated || "") + "").trim().toLowerCase();
		const day = ((row.TimeFrameDay || "") + "").trim().toLowerCase();
		const sunset = ((row.TimeFrameSunset || "") + "").trim().toLowerCase();
		const night = ((row.TimeFrameNight || "") + "").trim().toLowerCase();
		const bestBait = ((row.BestBait || "") + "").trim().toLowerCase();
		const mission = ((row.Mission || "") + "").trim().toLowerCase();
		const species = ((row.Species || "") + "").trim().toLowerCase();
		return [fishKey, stop, day, sunset, night, bestBait, mission, species].join("|");
	}

	function getBiteTimeForBestBait(row) {
		return window.OceanCollection.baitInfo(row).rawTime;
	}

	function parseCsv(text) {
		if (!text) {
			return [];
		}

		const rows = [];
		let row = [];
		let value = "";
		let inQuotes = false;

		for (let i = 0; i < text.length; i += 1) {
			const char = text[i];

			if (char === '"') {
				if (inQuotes && text[i + 1] === '"') {
					value += '"';
					i += 1;
				} else {
					inQuotes = !inQuotes;
				}
				continue;
			}

			if (char === "," && !inQuotes) {
				row.push(value);
				value = "";
				continue;
			}

			if ((char === "\n" || char === "\r") && !inQuotes) {
				if (char === "\r" && text[i + 1] === "\n") {
					i += 1;
				}

				row.push(value);
				if (row.length > 1 || row[0] !== "") {
					rows.push(row);
				}
				row = [];
				value = "";
				continue;
			}

			value += char;
		}

		row.push(value);
		if (row.length > 1 || row[0] !== "") {
			rows.push(row);
		}

		if (rows.length < 2) {
			return [];
		}

		const headers = rows[0];
		const dataRows = [];

		for (let i = 1; i < rows.length; i += 1) {
			const rowValues = rows[i];
			const dataRow = {};

			for (let j = 0; j < headers.length; j += 1) {
				dataRow[headers[j]] = rowValues[j] || "";
			}

			dataRows.push(dataRow);
		}

		return dataRows;
	}

	function renderRoute(routeId) {
		const list = routeFish[routeId];
		const container = document.getElementById(routeId + "ChecklistContainer");
		if (!container) {
			return;
		}

		const groups = groupFishByLocation(list);
		const accordionItems = [];
		const tableIds = [];
		let sectionCounter = 0;
		let tableCounter = 0;

		groups.forEach((group) => {
			if (group.base.length) {
				const baseCaught = getCaughtCountForFishList(routeId, group.base);
				const baseTotal = group.base.length;
				const baseTableId =
					routeId + "ChecklistTable-" + encodeIdPart(group.id) + "-base-" + tableCounter;
				tableCounter += 1;
				tableIds.push(baseTableId);
				accordionItems.push(
					buildAccordionItemHtml(
						routeId,
						"section" + sectionCounter,
						escapeHtml(group.location),
						escapeHtml(baseCaught + "/" + baseTotal),
						buildChecklistTableHtml(
							baseTableId,
							buildRowsHtml(routeId, group.base, true),
							true
						)
					)
				);
				sectionCounter += 1;
			}

			if (group.spectral.length) {
				const spectralCaught = getCaughtCountForFishList(routeId, group.spectral);
				const spectralTotal = group.spectral.length;
				const spectralTableId =
					routeId +
					"ChecklistTable-" +
					encodeIdPart(group.id) +
					"-spectral-" +
					tableCounter;
				tableCounter += 1;
				tableIds.push(spectralTableId);
				accordionItems.push(
					buildAccordionItemHtml(
						routeId,
						"section" + sectionCounter,
						escapeHtml(
							group.location + " - " + t("checklist.spectralcurrent", "Spectral Current")
						),
						escapeHtml(spectralCaught + "/" + spectralTotal),
						buildChecklistTableHtml(
							spectralTableId,
							buildRowsHtml(routeId, group.spectral, false),
							false
						)
					)
				);
				sectionCounter += 1;
			}
		});

		routeTableIds[routeId] = tableIds;

		container.innerHTML =
			"<div class='checklist-controls'>" +
			"<p class='checklist-count' id='" +
			routeId +
			"Progress'></p>" +
			"</div>" +
			"<div class='accordion' id='" +
			routeId +
			"ChecklistAccordion'>" +
			accordionItems.join("") +
			"</div>";

        const firstPanel = container.querySelector('.accordion-collapse');
        if (firstPanel) {
            firstPanel.classList.add('show');
            const button = firstPanel.closest('.accordion-item').querySelector('.accordion-button');
            button.classList.remove('collapsed'); button.setAttribute('aria-expanded','true');
        }
        const empty = document.createElement('p'); empty.className = 'checklist-empty'; empty.hidden = true; empty.textContent = '조건에 맞는 물고기가 없어요. 검색어나 미획득 필터를 바꿔 보세요.'; container.append(empty);
		updateProgress(routeId);
	}

	function getCaughtCountForFishList(routeId, fishList) {
		if (!state[routeId]) {
			return 0;
		}
		return fishList.reduce((count, fish) => {
			return OceanCollection.caught(state, routeId, fish.name) ? count + 1 : count;
		}, 0);
	}

	function buildAccordionItemHtml(routeId, sectionKey, headingHtml, caughtTextHtml, bodyHtml) {
		const headingId = routeId + "ChecklistHeading-" + sectionKey;
		const collapseId = routeId + "ChecklistCollapse-" + sectionKey;

		return (
			"<div class='accordion-item'>" +
			"<h2 class='accordion-header' id='" +
			headingId +
			"'>" +
			"<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#" +
			collapseId +
			"' aria-expanded='false' aria-controls='" +
			collapseId +
			"'>" +
			"<span>" +
			headingHtml +
			"</span>" +
			"<span class='accordion-caught-count'>" +
			caughtTextHtml +
			"</span>" +
			"</button>" +
			"</h2>" +
			"<div id='" +
			collapseId +
			"' class='accordion-collapse collapse' aria-labelledby='" +
			headingId +
			"'>" +
			"<div class='accordion-body'>" +
			bodyHtml +
			"</div>" +
			"</div>" +
			"</div>"
		);
	}

	function groupFishByLocation(list) {
		const groups = [];
		const byLocation = Object.create(null);

		list.forEach((fish) => {
			const location = getFishingStopLabel(fish.stopId, fish.stop) || t("table.location", "Location");
			const id = (fish.stopId || location).trim().toLowerCase();
			if (!byLocation[id]) {
				byLocation[id] = {
					id: id,
					location: location,
					base: [],
					spectral: [],
				};
				groups.push(byLocation[id]);
			}

			if ((fish.timeFrameDay || "").trim() === "") {
				byLocation[id].base.push(fish);
			} else {
				byLocation[id].spectral.push(fish);
			}
		});

		return groups;
	}

	function buildRowsHtml(routeId, fishList, showWeather) {
		return fishList
			.map((fish) => {
				const checked = OceanCollection.caught(state, routeId, fish.name) ? "checked" : "";
				const rowClass = OceanCollection.caught(state, routeId, fish.name)
					? "caughtRow selectedGreen"
					: "";
				const checkboxId = routeId + "-" + encodeIdPart(fish.stateKey);
				const fishImgHtml =
					"<img class='iconSmall' src='../img/fish/" +
					fish.fishImageName +
					".png' alt='" +
					escapeAttr(fish.displayName) +
					"' data-bs-toggle='tooltip' data-bs-title='" +
					escapeAttr(fish.displayName) +
					"' tabindex='0'>";
				const bestBaitHtml = getBestBaitHtml(
					fish.bestBait,
					fish.bestBaitTranslated
				);
				const dayIconHtml = getTimeFrameIconHtml("Day", fish.timeFrameDay);
				const nightIconHtml = getTimeFrameIconHtml("Night", fish.timeFrameNight);
				const sunsetIconHtml = getTimeFrameIconHtml("Sunset", fish.timeFrameSunset);
				const timeOfDayHtml = dayIconHtml + nightIconHtml + sunsetIconHtml;
				const starsHtml = getStarsHtml(fish.stars);

				return (
					"<tr class='" + rowClass + "'>" +
					"<td class='text-center'>" +
					"<input class='editor-active caughtFish fish-check' type='checkbox' id='" +
					checkboxId +
					"' data-route='" +
					routeId +
					"' data-fish='" +
					escapeAttr(fish.stateKey) +
					"' " +
					checked +
					">" +
					"</td>" +
					"<td class='text-center'>" +
					"<div class='checklist-icon-wrap'>" +
					fishImgHtml +
					"</div>" +
					"</td>" +
					"<td>" +
					"<span class='fish-name'>" +
					escapeHtml(fish.displayName) +
					"</span>" +
					(fish.dataNotes ? "<details class='fish-note data-fish-note'><summary>참고</summary><span>" + escapeHtml(fish.dataNotes) + "</span></details>" : "") +
					(fish.intuition
						? "<div class='fish-intuition'>" + getIntuitionHtml(fish.intuition) + "</div>"
						: "") +
					"</td>" +
					"<td class='text-center'>" +
					starsHtml +
					"</td>" +
					"<td class='text-center'>" +
					"<div class='checklist-icon-wrap'>" +
					bestBaitHtml +
					"</div>" +
					"</td>" +
					"<td class='text-center'>" +
					escapeHtml(window.OceanCollection.biteTimeText(fish.biteTime)) +
					"</td>" +
					"<td class='text-center'>" +
					getBiteHooksetHtml(fish.bite, fish.hookset, fish.hooksetName) +
					"</td>" +
					"<td class='text-center'>" +
					escapeHtml(fish.points) +
					"</td>" +
					"<td class='text-center'>" +
					getHookYieldHtml(fish.dh, fish.points) +
					"</td>" +
					"<td class='text-center'>" +
					getHookYieldHtml(fish.th, fish.points) +
					"</td>" +
					"<td class='text-center'>" +
					"<div class='checklist-icon-wrap'>" +
					timeOfDayHtml +
					"</div>" +
					"</td>" +
					(showWeather
						? "<td class='text-center'>" + getWeatherHtml(fish.weather) + "</td>"
						: "") +
					"<td>" +
					getSpeciesHtml(fish.species, fish.speciesTranslated, fish.mission) +
					"</td>" +
					"</tr>"
				);
			})
			.join("");
	}

	function buildChecklistTableHtml(tableId, rowsHtml, showWeather) {
		return (
			"<div class='table-responsive'>" +
			"<table id='" +
			tableId +
			"' class='table table-striped table-hover align-middle mb-0' style='width:100%;'>" +
			"<thead>" +
			"<tr>" +
			"<th class='text-center' style='width: 70px;'>" +
			t("table.caught", "Caught") +
			"</th>" +
			"<th class='text-center'></th>" +
			"<th>" + t("table.fish", "Fish") + "</th>" +
			"<th class='text-center'>" + t("table.stars", "Stars") + "</th>" +
			"<th class='text-center'>" + t("table.bestbait", "Best Bait") + "</th>" +
			"<th class='text-center'>" + t("table.bitetime", "Bite Time") + "</th>" +
			"<th class='text-center'>" + t("table.bite", "Bite") + "</th>" +
			"<th class='text-center'>" + t("table.points", "Points") + "</th>" +
			"<th class='text-center'>" + t("table.dhyield", "DH") + "</th>" +
			"<th class='text-center'>" + t("table.thyield", "TH") + "</th>" +
			"<th class='text-center'>" + t("table.timeofday", "Time") + "</th>" +
			(showWeather
				? "<th class='text-center'>" + t("table.weather", "Weather") + "</th>"
				: "") +
			"<th>" + t("table.species", "Species") + "</th>" +
			"</tr>" +
			"</thead>" +
			"<tbody>" +
			rowsHtml +
			"</tbody>" +
			"</table>" +
			"</div>"
		);
	}

	function initSortableTable(routeId) {
		if (typeof DataTable === "undefined" || typeof $ === "undefined") {
			return;
		}

		(routeTableIds[routeId] || []).forEach((tableId) => {
			const selector = "#" + tableId;
			if ($.fn.dataTable.isDataTable(selector)) {
				$(selector).DataTable().destroy();
			}

			const tableApi = new DataTable(selector, {
				paging: false,
				info: false,
				searching: false,
				autoWidth: false,
				ordering: false,
				columnDefs: [
					{
						targets: "_all",
						className: "text-center",
					},
				],
				drawCallback: function () {
					initTooltips();
				},
			});
		});
	}

	function bindCheckboxEvents() {
		document.addEventListener("change", function (event) {
			const target = event.target;
			if (!target.classList.contains("fish-check")) {
				return;
			}

			const routeId = target.getAttribute("data-route");
			const fishName = target.getAttribute("data-fish");
			if (!routeId || !fishName || !state[routeId]) {
				return;
			}

            const previous = OceanCollection.caught(OceanCollection.read(localStorage), routeId, fishName.split('|')[0]);
			try {
                state = OceanCollection.setCaught(localStorage, routeId, fishName.split('|')[0], target.checked);
            } catch {
                target.checked = !target.checked;
                document.getElementById('checklistMessage').textContent = '브라우저 저장에 실패했어요. 저장 공간·사이트 권한을 확인해 주세요.';
                return;
            }
            OceanUX.preserveScroll(syncChecks);
            const label = target.closest('tr').querySelector('.fish-name').textContent;
            OceanUX.catchChanged(routeId, fishName.split('|')[0], previous, target.checked, label, () => { state = OceanCollection.read(localStorage); syncChecks(); });
			const tr = target.closest("tr");
			if (tr) {
				if (target.checked) {
					tr.classList.add("caughtRow", "selectedGreen");
				} else {
					tr.classList.remove("caughtRow", "selectedGreen");
				}
				updateAccordionCountForRow(tr);
				if (!tr.hasAttribute("tabindex")) {
					tr.setAttribute("tabindex", "0");
				}
                (tr.hidden ? document.getElementById('undoCatch') : tr).focus({ preventScroll: true });
			}
			updateExportButtonVisibility();
			updateProgress(routeId);
		});

		document.addEventListener("keydown", function (event) {
			if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
				return;
			}

			const active = document.activeElement;
			if (!active) {
				return;
			}

			// Support focus on a <tr> directly or on a child element inside a <tr>
			const tr = active.tagName === "TR" ? active : active.closest("tr");
			if (!tr || !tr.closest("table")) {
				return;
			}

			event.preventDefault();

			const tbody = tr.closest("tbody");
			if (!tbody) {
				return;
			}

			const rows = Array.from(tbody.querySelectorAll("tr"));
			const currentIndex = rows.indexOf(tr);
			if (currentIndex === -1) {
				return;
			}

			const nextIndex = event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
			if (nextIndex < 0 || nextIndex >= rows.length) {
				return;
			}

			const nextRow = rows[nextIndex];
			if (!nextRow.hasAttribute("tabindex")) {
				nextRow.setAttribute("tabindex", "0");
			}
			nextRow.focus({ preventScroll: false });
		});
	}

	function updateAccordionCountForRow(rowEl) {
		if (!rowEl) {
			return;
		}

		const tbody = rowEl.closest("tbody");
		if (!tbody) {
			return;
		}

		const total = tbody.querySelectorAll("tr").length;
		const caught = tbody.querySelectorAll("input.fish-check:checked").length;

		const accordionItem = rowEl.closest(".accordion-item");
		if (!accordionItem) {
			return;
		}

		const countEl = accordionItem.querySelector(".accordion-caught-count");
		if (!countEl) {
			return;
		}

		countEl.textContent = String(caught) + "/" + String(total);
	}

	function getStarsHtml(starsValue) {
		if (!starsValue) {
			return "";
		}
		const numStars = parseInt(starsValue, 10);
		if (isNaN(numStars)) {
			return "";
		}
		let stars = "";
		for (let i = 0; i < numStars; i++) {
			stars += "★";
		}
		return stars;
	}

	function getSpeciesHtml(species, speciesTranslated, mission) {
		const key = (species || "").trim() || (mission || "").trim();
		const label = (speciesTranslated || species || "").trim();
		const speciesIconMap = {
			Manta: "manta_mark.png",
			Fugu: "balloon_mark.png",
			Crab: "crab_mark.png",
			Seadragon: "dragon_mark.png",
			Jellyfish: "jelly_mark.png",
			Octopus: "octo_mark.png",
			Shark: "shark_mark.png",
			Shellfish: "mussel_mark.png",
			Squid: "squid_mark.png",
			Shrimp: "shrimp_mark.png",
			Prehistoric: "prehistoric_mark.png",
			Mantis: "mantis_mark.png",
			J: "jelly_mark.png",
			O: "octo_mark.png",
			S: "shark_mark.png",
			M: "mussel_mark.png",
			Q: "squid_mark.png",
			H: "shrimp_mark.png",
			P: "prehistoric_mark.png",
			N: "mantis_mark.png",
			C: "crab_mark.png",
			D: "dragon_mark.png",
			F: "balloon_mark.png",
		};

		const iconFile = speciesIconMap[key];
		if (!iconFile) {
			return escapeHtml(label);
		}

		return (
			"<span class='badge speciesbadge rounded-pill'>" +
			"<img src='../img/" +
			iconFile +
			"' class='iconSmaller' alt='" +
			escapeAttr(label) +
			"' data-bs-toggle='tooltip' data-bs-title='" +
			escapeAttr(label) +
			"' tabindex='0'>" +
			"</span>"
		);
	}

	function getBiteHooksetHtml(bite, hookset, hooksetName) {
		var hooksetImg;
		var hookLabel = escapeAttr(hooksetName || hookset || "");
		if (hookset === "Powerful") {
			hooksetImg = "<img src='../img/Powerful.png' class='iconSmaller' data-bs-toggle='tooltip' data-bs-title='" + hookLabel + "' tabindex='0'>";
		} else {
			hooksetImg = "<img src='../img/Precision.png' class='iconSmaller' data-bs-toggle='tooltip' data-bs-title='" + hookLabel + "' tabindex='0'>";
		}

		var biteBadge;
		switch (bite) {
			case "!":
				biteBadge = "<span class=\"badge bitebadge bg-success\">!<span class=\"visually-hidden\"> ! </span></span>";
				break;
			case "!!":
				biteBadge = "<span class=\"badge bitebadge bg-primary\">!!<span class=\"visually-hidden\">!!</span></span>";
				break;
			default:
				biteBadge = "<span class=\"badge bitebadge bg-danger\">!!!<span class=\"visually-hidden\">!!!</span></span>";
				break;
		}

		return "<div class='d-flex flex-column align-items-center gap-1'>" + biteBadge + hooksetImg + "</div>";
	}

	function getHookYieldHtml(raw, points) {
		if (!raw || raw === "" || raw === "0") return "";
		var rawStr = String(raw).trim();
		var pts = parseFloat(points);
		if (isNaN(pts)) return escapeHtml(rawStr);
		var isRange = rawStr.indexOf("-") !== -1;
		var parts = rawStr.split("-");
		var lo = parseFloat(parts[0].trim());
		var hi = isRange && parts[1] ? parseFloat(parts[1].trim()) : lo;
		if (isRange) {
			return escapeHtml(String(pts * lo) + " - " + String(pts * hi) + " (" + rawStr + ")");
		} else {
			return escapeHtml(String(pts * lo) + " (" + rawStr + ")");
		}
	}

	function getIntuitionHtml(intuitionValue) {
		if (!intuitionValue) {
			return "";
		}

		const trimmed = intuitionValue.trim();
		if (!trimmed) {
			return "";
		}

		// Keep embedded fish-icon markup from CSV and normalize relative image paths.
		if (trimmed.indexOf("<") !== -1 && trimmed.indexOf(">") !== -1) {
			return trimmed
				.replace(/src=(["'])\/img\//g, "src=$1../img/")
				.replace(/\.\.\/\.\.\/img\//g, "../img/")
				.replace(/data-bs-tooltip="popover"/g, 'data-bs-toggle="tooltip"')
				.replace(/data-bs-toggle="popover"/g, 'data-bs-toggle="tooltip"')
				.replace(/data-bs-content=/g, "data-bs-title=");
		}

		return escapeHtml(trimmed).replace(/\n/g, "<br/>");
	}

	function getBestBaitHtml(bestBait, bestBaitTranslated) {
		if (!bestBait) {
			const label = bestBaitTranslated || '추천 미끼 미확인';
			return (
				"<img class='iconSmall' src='../img/bait/Bait.png' alt='" +
				escapeAttr(label) +
				"' data-bs-toggle='tooltip' data-bs-title='" +
				escapeAttr(label) +
				"' tabindex='0'>"
			);
		}

		const baitLabel = bestBaitTranslated || bestBait;

		if (bestBait.substring(0, 2) === "M!") {
			const fishBait = normalizeFishName(bestBait);
			const fishBaitLabel = normalizeFishName(baitLabel || "") || fishBait;
			return (
				"<img class='iconSmall' src='../img/fish/" +
				fishBait.replace(/'/g, "_") +
				".png' alt='" +
				escapeAttr(fishBaitLabel) +
				"' data-bs-toggle='tooltip' data-bs-title='" +
				escapeAttr(fishBaitLabel) +
				"' tabindex='0'>"
			);
		}

		return (
			"<img class='iconSmall' src='../img/bait/" +
			bestBait.replace(/\s/g, "") +
			".png' alt='" +
			escapeAttr(baitLabel) +
			"' data-bs-toggle='tooltip' data-bs-title='" +
			escapeAttr(baitLabel) +
			"' tabindex='0'>"
		);
	}

	function getTimeFrameIconHtml(period, value) {
		const isCatchable = value === "" || value === "Yes";
		const fileName = period === "Day" ? "ocDay" : period === "Night" ? "ocNight" : "ocSunset";
		const status = isCatchable
			? t("checklist.catchable" + period, "Catchable during " + period)
			: t("checklist.notCatchable" + period, "Not Catchable during " + period);
		const classNames = isCatchable
			? "time-icon-small time-icon-shadow"
			: "time-icon-small time-icon-shadow notCatchable";

		return (
			"<img src='../img/" +
			fileName +
			".png' alt='" +
			period +
			"' data-bs-toggle='tooltip' data-bs-title='" +
			status +
			"' class='" +
			classNames +
			"'" +
			">"
		);
	}

	function getWeatherHtml(weather) {
		if (!weather) {
			return escapeHtml(t("table.any", "Any"));
		}

		let weatherIcons = "";
		const addWeatherIcon = function (fileName, label) {
			if (!fileName || !label) {
				return;
			}
			weatherIcons +=
				"<img class='iconMini' src='../img/Weather/" +
				fileName +
				".png' alt='" +
				escapeAttr(label) +
				"' data-bs-toggle='tooltip' data-bs-title='" +
				escapeAttr(label) +
				"' tabindex='0'>";
		};

		if (weather.fairSkies !== "Yes") {
			addWeatherIcon("Fair Skies", t("table.fairskies", "Fair Skies"));
		}
		if (weather.clouds !== "Yes") {
			addWeatherIcon("Clouds", t("table.clouds", "Clouds"));
		}
		if (weather.fog !== "Yes") {
			addWeatherIcon("Fog", t("table.fog", "Fog"));
		}
		if (weather.special1 !== "Yes") {
			addWeatherIcon(weather.special1Type, weather.special1TypeTranslated || weather.special1Type);
		}
		if (weather.special2 !== "Yes") {
			addWeatherIcon(weather.special2Type, weather.special2TypeTranslated || weather.special2Type);
		}
		if (weather.special3 === "No") {
			addWeatherIcon(weather.special3Type, weather.special3TypeTranslated || weather.special3Type);
		}
		if (weather.clearSkies !== "Yes") {
			addWeatherIcon("Clear Skies", t("table.clearskies", "Clear Skies"));
		}

		if (!weatherIcons) {
			return escapeHtml(t("table.any", "Any"));
		}

		const notText = escapeHtml(t("table.not", "Not"));
		const lang = getChecklistLanguage();
		if (lang === "jp" || lang === "ko") {
			return weatherIcons + " " + notText;
		}

		return notText + " " + weatherIcons;
	}

	function initTooltips() {
		if (typeof bootstrap === "undefined" || !bootstrap.Tooltip) {
			return;
		}

		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		Array.from(tooltipTriggerList).forEach((tooltipTriggerEl) => {
			const title = tooltipTriggerEl.getAttribute("data-bs-title") || tooltipTriggerEl.getAttribute("title");
			if (typeof title === "string" && title.trim() !== "") {
				bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl);
			}
		});
	}

	function bindTabState() {
		["ruby-tab", "indigo-tab"].forEach((tabId) => {
			const tabButton = document.getElementById(tabId);
			if (!tabButton) {
				return;
			}

			tabButton.addEventListener("shown.bs.tab", function (event) {
				const selectedId = event.target.id === "indigo-tab" ? "indigo" : "ruby";
				localStorage.setItem(ACTIVE_TAB_KEY, selectedId);
				adjustTableColumns(selectedId);
			});
		});
	}

	function restoreActiveTab() {
		const saved = localStorage.getItem(ACTIVE_TAB_KEY);
		if (saved !== "indigo") {
			adjustTableColumns("ruby");
			return;
		}

		const tabEl = document.getElementById("indigo-tab");
		if (tabEl && typeof bootstrap !== "undefined") {
			bootstrap.Tab.getOrCreateInstance(tabEl).show();
			setTimeout(function () {
				adjustTableColumns("indigo");
			}, 0);
		}
	}

	function adjustTableColumns(routeId) {
		if (typeof $ === "undefined" || !$.fn.dataTable) {
			return;
		}

		(routeTableIds[routeId] || []).forEach((tableId) => {
			const selector = "#" + tableId;
			if (!$.fn.dataTable.isDataTable(selector)) {
				return;
			}

			const table = $(selector).DataTable();
			table.columns.adjust().draw(false);
		});
	}

	function updateProgress(routeId) {
		const progressEl = document.getElementById(routeId + "Progress");
		if (!progressEl) {
			return;
		}

		const uniqueFish = [...new Map(routeFish[routeId].map(fish => [OceanCollection.key(fish.name), fish])).values()];
		const total = uniqueFish.length;
		let caught = 0;

		uniqueFish.forEach((fish) => {
			if (OceanCollection.caught(state, routeId, fish.name)) {
				caught += 1;
			}
		});

		let progressText = t("checklist.progress", "Caught {0} of {1} fish");
		progressText = progressText.replace("{0}", caught).replace("{1}", total);
		progressEl.textContent = progressText;
	}

	function t(key, fallback) {
		const labels = { 'checklist.spectralcurrent': '환해류', 'table.bitetime': '입질 시간' };
		if (labels[key]) return labels[key];
		if (typeof translateWord === "function") {
			const translated = translateWord(key);
			if (translated && translated !== key) {
				return translated;
			}
		}
		return fallback;
	}

	function loadState() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) {
				return { ruby: {}, indigo: {} };
			}

			const parsed = JSON.parse(raw);
			return {
				ruby: parsed.ruby || {},
				indigo: parsed.indigo || {},
			};
		} catch (error) {
			console.warn("Could not read saved checklist state:", error);
			return { ruby: {}, indigo: {} };
		}
	}

	function getChecklistLanguage() { return "ko"; }

	function hasExportableChecklistData() {
		return ROUTES.some(function (route) {
			const routeState = state[route.id] || {};
			return Object.keys(routeState).some(function (fishName) {
				return routeState[fishName] === true;
			});
		});
	}

	function updateExportButtonVisibility() {
		const exportBtn = document.getElementById("exportChecklistBtn");
		if (!exportBtn) {
			return;
		}
		exportBtn.classList.remove("d-none");
	}

	function exportState() { OceanUX.exportRecords(); }

	async function importStateFromFile(file) {
        if (!file) return;
        const message = document.getElementById('checklistMessage');
        try {
            if (file.size > 2 * 1024 * 1024) throw new Error('파일이 너무 커요. 체크리스트 JSON 파일을 선택해 주세요.');
            const result = OceanCollection.importCaught(localStorage, await file.text());
            state = result.state;
            syncChecks();
            message.textContent = OceanUX.importMessage(result);
            OceanUX.notice(message.textContent);
        } catch (error) {
            message.textContent = '가져오지 못했어요. ' + (error instanceof SyntaxError ? '올바른 JSON 파일을 선택해 주세요.' : error.message);
        }
    }

    function syncChecks() {
        document.querySelectorAll('.fish-check').forEach(input => {
            input.checked = OceanCollection.caught(state, input.dataset.route, input.dataset.fish.split('|')[0]);
            const row = input.closest('tr');
            row.classList.toggle('caughtRow', input.checked);
            row.classList.toggle('selectedGreen', input.checked);
            updateAccordionCountForRow(row);
        });
        ROUTES.forEach(route => updateProgress(route.id));
        updateExportButtonVisibility();
        applyChecklistFilters();
    }
    window.addEventListener('storage', event => {
        if (event.key === STORAGE_KEY || event.key === null) {
            state = OceanCollection.read(localStorage);
            if (dataReady) syncChecks();
        }
    });
    document.addEventListener('ocean-records-imported', () => { state = OceanCollection.read(localStorage); if (dataReady) syncChecks(); });

	function bindImportExport() {
		const exportBtn = document.getElementById("exportChecklistBtn");
		if (exportBtn) {
			exportBtn.addEventListener("click", exportState);
		}
		updateExportButtonVisibility();
		const importInput = document.getElementById("importChecklistFile");
        document.getElementById("importChecklistBtn").addEventListener("click", () => importInput.click());
		if (importInput) {
			importInput.addEventListener("change", function () {
				importStateFromFile(this.files[0]);
				this.value = "";
			});
		}
	}

	function showLoadError() {
		["rubyChecklistContainer", "indigoChecklistContainer"].forEach((id) => {
			const container = document.getElementById(id);
			if (!container) {
				return;
			}
			container.innerHTML =
				"<div class='alert alert-danger mb-0'>데이터를 불러오지 못했어요. 새로고침해서 다시 시도해 주세요.</div>";
		});
	}

	function encodeIdPart(value) {
		return value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	}

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function escapeAttr(value) {
		return escapeHtml(value).replace(/`/g, "&#96;");
	}

    let filtering = false;
    const expandedBeforeSearch = new Map();
    function applyChecklistFilters(switchTab = false) {
        if (!dataReady) return;
        const query = document.getElementById('checklistSearch').value.trim();
        const uncaught = document.getElementById('checklistUncaught').checked;
        const active = !!query || uncaught;
        if (active && !filtering) {
            expandedBeforeSearch.clear();
            document.querySelectorAll('.accordion-collapse').forEach(panel => expandedBeforeSearch.set(panel.id, panel.classList.contains('show')));
        }
        const counts = {};
        for (const route of ['indigo','ruby']) {
            const container = document.getElementById(route + 'ChecklistContainer');
            const matches = new Set();
            container.querySelectorAll('.fish-check').forEach(input => {
                const row = input.closest('tr');
                const name = row.querySelector('.fish-name').textContent;
                const english = input.dataset.fish.split('|')[0];
                const show = (!uncaught || !input.checked) && (OceanUX.matchesName(name,query) || OceanUX.matchesName(english,query));
                row.hidden = !show;
                if (show) matches.add(OceanCollection.key(english));
            });
            container.querySelectorAll('.accordion-item').forEach(section => {
                const inputs = [...section.querySelectorAll('.fish-check')];
                const hasMatches = inputs.some(input => !input.closest('tr').hidden);
                section.hidden = !hasMatches;
                const caughtCount = inputs.filter(input => input.checked).length;
                const shownCount = inputs.filter(input => !input.closest('tr').hidden).length;
                section.querySelector('.accordion-caught-count').textContent = caughtCount + '/' + inputs.length + (active ? ' · 표시 ' + shownCount : '');
                const panel = section.querySelector('.accordion-collapse');
                if (active || filtering) {
                    const expanded = active ? hasMatches : expandedBeforeSearch.get(panel.id);
                    panel.classList.toggle('show', !!expanded);
                    const button = section.querySelector('.accordion-button');
                    button.classList.toggle('collapsed', !expanded); button.setAttribute('aria-expanded', String(!!expanded));
                }
            });
            const empty = container.querySelector('.checklist-empty');
            if (empty) empty.hidden = matches.size > 0;
            counts[route] = matches.size;
        }
        filtering = active;
        document.getElementById('checklistResults').textContent = '검색 결과 · 근해 ' + counts.indigo + '종 / 원양 ' + counts.ruby + '종';
        if (switchTab && active) {
            const selected = document.getElementById('ruby-tab').classList.contains('active') ? 'ruby' : 'indigo';
            const other = selected === 'ruby' ? 'indigo' : 'ruby';
            if (!counts[selected] && counts[other]) bootstrap.Tab.getOrCreateInstance(document.getElementById(other + '-tab')).show();
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('checklistSearch');
        input.addEventListener('input', () => applyChecklistFilters(true));
        input.addEventListener('compositionend', () => applyChecklistFilters(true));
        document.getElementById('checklistUncaught').addEventListener('change', () => applyChecklistFilters(true));
        document.getElementById('clearChecklistSearch').addEventListener('click', () => {
            input.value = ''; document.getElementById('checklistUncaught').checked = false;
            applyChecklistFilters(); input.focus({preventScroll:true});
        });
    });
})();
