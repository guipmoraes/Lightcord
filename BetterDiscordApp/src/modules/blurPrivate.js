/**
 * Credits to @hellbound1337 on github for the css
 */

import DOMTools from "./domtools"

let selectors
function getSelectors(){
    let standardSidebarView = BDModules.get(e => e.standardSidebarView)[0]
    if(!standardSidebarView)return null
    let defaultClassName = removeDa(standardSidebarView.standardSidebarView)
    let selects = []
    selects.push(`#app-mount .${defaultClassName} .payment-info .${removeDa(BDModules.get(e => e.description && typeof e.description === "string" && e.description.includes("formText"))[0].description)}`)
    selects.push(`#app-mount .${defaultClassName} .${removeDa(BDModules.get(e => e.paymentSourceRow)[0].paymentSourceRow)} .${removeDa(BDModules.get(e => e.subText && e.descriptionWrapper)[0].subText)}`)
    selects.push(`#app-mount .${defaultClassName} .${removeDa(BDModules.get(e => e.userSettingsAccount)[0].userSettingsAccount)} div:nth-child(2)>div:nth-child(2)>.${removeDa(BDModules.get(e => e.viewBody)[0].viewBody)}`)
    return selects
}
function removeDa(className){
    if(!className)return className
    return className.split(" ").filter(e => !e.startsWith("da-")).join(" ")
}

export default new class BlurPrivate {
    constructor(){
        this.enabled = false
    }

    enable(){
        if(this.enabled)return
        this.enabled = true
        selectors = selectors || getSelectors()

        if(!selectors)console.error(new Error("Couldn't find selectors to blur personnal informations."))
        DOMTools.addStyle("blurPrivate", `
${selectors[0]}, ${selectors[1]}, ${selectors[2]} {
    transition: all 150ms cubic-bezier(.55,.085,.68,.53);
    filter: blur(4px);
    opacity: .8;
}

${selectors[0]}:hover, ${selectors[1]}:hover, ${selectors[2]}:hover {
    transition: all 150ms cubic-bezier(.55,.09,.68,.53);
    filter: none;
    opacity: 1;
}`)
    }

    disable(){
        if(!this.enabled)return
        this.enabled = false
        DOMTools.removeStyle("blurPrivate")
    }
}