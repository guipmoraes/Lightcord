/**
 * Tooltip that automatically show and hide themselves on mouseenter and mouseleave events.
 * Will also remove themselves if the node to watch is removed from DOM through
 * a MutationObserver.
 *
 * Note this is not using Discord's internals but normal DOM manipulation and emulates
 * Discord's own tooltips as closely as possible.
 *
 * @module EmulatedTooltip
 * @version 0.0.1
 */

import Utils from "../modules/utils";
import WebpackModules from "../modules/webpackModules";
let TooltipClasses
function getTooltipClasses(){
	if(TooltipClasses)return TooltipClasses
	return TooltipClasses = WebpackModules.findByProps("tooltip", "tooltipBlack");
}
let TooltipLayers
function getTooltipLayers(){
	if(TooltipLayers)return TooltipLayers
	return TooltipLayers = WebpackModules.findByProps("layer", "layerContainer");
}

const getClass = function(sideOrColor) {
    const upperCase = sideOrColor[0].toUpperCase() + sideOrColor.slice(1);
    const tooltipClass = getTooltipClasses()[`tooltip${upperCase}`];
    if (tooltipClass) return tooltipClass;
    return null;
};

const classExists = function(sideOrColor) {
    return getClass(sideOrColor) ? true : false;
};

const toPx = function(value) {
    return `${value}px`;
};

export default class EmulatedTooltip {
	/**
	 *
	 * @constructor
	 * @param {(HTMLElement|jQuery)} node - DOM node to monitor and show the tooltip on
	 * @param {string} tip - string to show in the tooltip
	 * @param {object} options - additional options for the tooltip
	 * @param {string} [options.style=black] - correlates to the discord styling/colors (black, brand, green, grey, red, yellow)
	 * @param {string} [options.side=top] - can be any of top, right, bottom, left
	 * @param {boolean} [options.preventFlip=false] - prevents moving the tooltip to the opposite side if it is too big or goes offscreen
     * @param {boolean} [options.disabled=false] - whether the tooltip should be disabled from showing on hover
     * @param {boolean} [options.attachEvents=true] - whether the tooltip should listen to mouseenter and mouseleave events.
	 */
	constructor(node, text, options = {}) {
		const {style = "black", side = "top", preventFlip = false, disabled = false, attachEvents = true} = options;
		this.node = node instanceof jQuery ? node[0] : node;
        this.label = text;
        this.style = style.toLowerCase();
		this.side = side.toLowerCase();
        this.preventFlip = preventFlip;
        this.disabled = disabled;

        if (!classExists(this.side)) return Utils.err("EmulatedTooltip", `Side ${this.side} does not exist.`);
		if (!classExists(this.style)) return Utils.err("EmulatedTooltip", `Style ${this.style} does not exist.`);
		
		this.element = document.createElement("div");
		this.element.className = getTooltipLayers().layer + " " + getTooltipLayers().disabledPointerEvents;

		this.tooltipElement = document.createElement("div");
		this.tooltipElement.className = `${getTooltipClasses().tooltip} ${getClass(this.style)}`;

		this.labelElement = document.createElement("div");
		this.labelElement.className = getTooltipClasses().tooltipContent

		const pointerElement = document.createElement("div");
		pointerElement.className = getTooltipClasses().tooltipPointer;

		this.tooltipElement.append(pointerElement);
		this.tooltipElement.append(this.labelElement);
		this.element.append(this.tooltipElement);

		if(attachEvents){
			this.node.addEventListener("mouseenter", () => {
				if (this.disabled) return;
				this.show();
	
				const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						const nodes = Array.from(mutation.removedNodes);
						const directMatch = nodes.indexOf(this.node) > -1;
						const parentMatch = nodes.some(parent => parent.contains(this.node));
						if (directMatch || parentMatch) {
							this.hide();
							observer.disconnect();
						}
					});
				});
	
				observer.observe(document.body, {subtree: true, childList: true});
			});
	
			this.node.addEventListener("mouseleave", () => {
				this.hide();
			});
		}
    }

    /** Container where the tooltip will be appended. */
    get container() { 
		return document.querySelector("."+Utils.removeDa(BDModules.get(e => e.popouts)[0].popouts)+" ~ ."+Utils.removeDa(BDModules.get(e => e.layerContainer)[0].layerContainer)); 
	}
    /** Boolean representing if the tooltip will fit on screen above the element */
    get canShowAbove() { return this.node.getBoundingClientRect().top - this.element.offsetHeight >= 0; }
    /** Boolean representing if the tooltip will fit on screen below the element */
    get canShowBelow() { return this.node.getBoundingClientRect().top + this.node.offsetHeight + this.element.offsetHeight <= Utils.screenHeight; }
    /** Boolean representing if the tooltip will fit on screen to the left of the element */
    get canShowLeft() { return this.node.getBoundingClientRect().left - this.element.offsetWidth >= 0; }
    /** Boolean representing if the tooltip will fit on screen to the right of the element */
	get canShowRight() { return this.node.getBoundingClientRect().left + this.node.offsetWidth + this.element.offsetWidth <= Utils.screenWidth; }

    /** Hides the tooltip. Automatically called on mouseleave. */
	hide() {
        this.element.remove();
        this.tooltipElement.className = this._className;
	}

    /** Shows the tooltip. Automatically called on mouseenter. Will attempt to flip if position was wrong. */
	show() {
        this.tooltipElement.className = `${getTooltipClasses().tooltip} ${getClass(this.style)}`;
		this.labelElement.textContent = this.label;
		this.container.append(this.element);

		if (this.side == "top") {
			if (this.canShowAbove || (!this.canShowAbove && this.preventFlip)) this.showAbove();
			else this.showBelow();
		}

		if (this.side == "bottom") {
			if (this.canShowBelow || (!this.canShowBelow && this.preventFlip)) this.showBelow();
			else this.showAbove();
		}

		if (this.side == "left") {
			if (this.canShowLeft || (!this.canShowLeft && this.preventFlip)) this.showLeft();
			else this.showRight();
		}

		if (this.side == "right") {
			if (this.canShowRight || (!this.canShowRight && this.preventFlip)) this.showRight();
			else this.showLeft();
		}
	}

    /** Force showing the tooltip above the node. */
	showAbove() {
		this.tooltipElement.classList.add(getClass("top"));
		this.element.style.setProperty("top", toPx(this.node.getBoundingClientRect().top - this.element.offsetHeight - 10));
		this.centerHorizontally();
	}

    /** Force showing the tooltip below the node. */
	showBelow() {
		this.tooltipElement.classList.add(getClass("bottom"));
		this.element.style.setProperty("top", toPx(this.node.getBoundingClientRect().top + this.node.offsetHeight + 10));
		this.centerHorizontally();
	}

    /** Force showing the tooltip to the left of the node. */
	showLeft() {
		this.tooltipElement.classList.add(getClass("left"));
		this.element.style.setProperty("left", toPx(this.node.getBoundingClientRect().left - this.element.offsetWidth - 10));
		this.centerVertically();
	}

    /** Force showing the tooltip to the right of the node. */
	showRight() {
		this.tooltipElement.classList.add(getClass("right"));
		this.element.style.setProperty("left", toPx(this.node.getBoundingClientRect().left + this.node.offsetWidth + 10));
		this.centerVertically();
	}

	centerHorizontally() {
        const nodecenter = this.node.getBoundingClientRect().left + (this.node.offsetWidth / 2);
        this.element.style.setProperty("left", toPx(nodecenter - (this.element.offsetWidth / 2)));
	}

	centerVertically() {
		const nodecenter = this.node.getBoundingClientRect().top + (this.node.offsetHeight / 2);
		this.element.style.setProperty("top", toPx(nodecenter - (this.element.offsetHeight / 2)));
	}
}