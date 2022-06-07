// let width = +prompt('How wide is your monitor?')
// let height = +prompt('How tall is your monitor?')

let width = 1920
let height = 1080
let colSize = 76
let rowSize = 100 

let numOfCol = Math.floor(width / colSize)
let numOfRow = Math.floor(height / rowSize)

let grid = {}
let row = 1
let labels = []
let labelIndex = 0

let pauseClick = false
let hiddenUI = false

let labelX = 912
let labelY = 105

document.getElementById('labelCreator').addEventListener('keypress', event => {
    if(event.code === 'Enter'){
        document.getElementById('labelCreator').blur()
        labelX = 912
        labelY = 105
        createLabel()
    }
    
})

document.addEventListener('keydown', event => {
    if(event.code === 'KeyW' && document.getElementById('labelCreator') != document.activeElement){
        labelX = findLabelX()
        labelY = findLabelY()
        labelY -= 25
        moveLabelUp(findSelectedLabel())
    }
    if(event.code === 'KeyD' && document.getElementById('labelCreator') != document.activeElement){
        labelX = findLabelX()
        labelY = findLabelY()
        labelX += 25.33
        moveLabelRight(findSelectedLabel())
    }
    if(event.code === 'KeyS' && document.getElementById('labelCreator') != document.activeElement){
        labelX = findLabelX()
        labelY = findLabelY()
        labelY += 25
        moveLabelDown(findSelectedLabel())
    }
    if(event.code === 'KeyA' && document.getElementById('labelCreator') != document.activeElement){
        labelX = findLabelX()
        labelY = findLabelY()
        labelX -= 25.33
        moveLabelLeft(findSelectedLabel())
    }
})

document.addEventListener('keypress', event => {
    if(event.code === 'KeyT' && hiddenUI == false && document.getElementById('labelCreator') != document.activeElement) {
        document.querySelector('label').style.visibility = 'hidden'
        document.getElementById('labelCreator').style.visibility = 'hidden'
        document.getElementById(findSelectedLabel()).style.border = 'none'
        hiddenUI = true
    }
    else if(event.code === 'KeyT' && hiddenUI == true && document.getElementById('labelCreator') != document.activeElement) {
        document.querySelector('label').style.visibility = 'visible'
        document.getElementById('labelCreator').style.visibility = 'visible'
        document.getElementById(findSelectedLabel()).style.border = '1px solid red'
        hiddenUI = false
    }

    // Delete key will delete the selected label
    if(event.code === 'KeyL' && document.getElementById('labelCreator') != document.activeElement){
        document.getElementById(findSelectedLabel()).style.visibility = 'hidden'
    }
})

calculateGridObject()
drawGrid()

function calculateGridObject(){
    do{
        for(let i = 1; i <= numOfCol; i++){
            if(!grid[row]) grid[row] = []
            grid[row].push(i)
        }
        row++
    }while(row <= numOfRow)
}

function drawGrid(){
    let container = document.getElementById("grid")
    for(let key in grid){
        for(let value in grid[key]){
            let numValue = +value
            let cell = document.createElement("div")
            // This adds the Row and Column to the HTML of the cell
            // EXPERIMENTAL CODE (cell.innerHTML = `Row ${key}: Cell ${numValue+1}`)
            cell.className = "cell"
            cell.id = `${key}: ${numValue+1}`
            cell.style.width = `${colSize}px`
            cell.style.height = `${rowSize}px`
            container.appendChild(cell)
            
            cell.onmouseover = _ => {
                cell.style.background = 'rgb(240,240,255)'
                cell.style.zIndex = '2'
            }

            cell.onmouseout = _ => {
                cell.style.background = 'rgba(0,0,0,0)'
                cell.style.zIndex = '1'
            }

            cell.onmousedown = _ => {
                // Box is clicked and the outline is removed
                if(cell.classList.contains('clicked')){
                    cell.className = 'cell'
                    cell.style.border = 'none'
                    pauseClick = true

                    /* ====================
                    Check surrounding cells
                    ==================== */
                        // Getting ID of cell clicked
                            let checkKey, checkValue
                            if(cell.id.length == 4){
                                checkKey = +cell.id.charAt(0)
                                checkValue = +cell.id.charAt(3)
                            }
                            else if(cell.id.length == 5){
                                // If checkKey is the single digit
                                if(cell.id.charAt(1) == ':'){
                                    checkKey = +cell.id.charAt(0)
                                    checkValue = +(cell.id.charAt(3) + cell.id.charAt(4))
                                }
                                // If checkKey is the double digit
                                else{
                                    checkKey = +(cell.id.charAt(0) + cell.id.charAt(1))
                                    checkValue = +cell.id.charAt(4)
                                }
                            }
                            else{
                                checkKey = +(cell.id.charAt(0) + cell.id.charAt(1))
                                checkValue = +(cell.id.charAt(4) + cell.id.charAt(5))
                            }

                        // Now we have checkKey and checkValue, we need to test all the cells around them
                            let currentCell = document.getElementById(`${checkKey}: ${checkValue}`)
                            let checkCellAbove = document.getElementById('dummyid')
                            let checkCellRight = document.getElementById('dummyid')
                            let checkCellBelow = document.getElementById('dummyid')
                            let checkCellLeft = document.getElementById('dummyid')
                            if(checkKey > 1) checkCellAbove = document.getElementById(`${checkKey-1}: ${checkValue}`)
                            if(checkValue < numOfCol) checkCellRight = document.getElementById(`${checkKey}: ${checkValue+1}`)
                            if(checkKey < numOfRow) checkCellBelow = document.getElementById(`${checkKey+1}: ${checkValue}`)
                            if(checkValue > 1) checkCellLeft = document.getElementById(`${checkKey}: ${checkValue-1}`)

                            if(checkCellAbove.classList.contains('clicked')){
                                checkCellAbove.style.borderBottom = '2px solid black'
                            }
                            if(checkCellRight.classList.contains('clicked')){
                                checkCellRight.style.borderLeft = '2px solid black'
                            }
                            if(checkCellBelow.classList.contains('clicked')){
                                checkCellBelow.style.borderTop = '2px solid black'
                            }
                            if(checkCellLeft.classList.contains('clicked')){
                                checkCellLeft.style.borderRight = '2px solid black'
                            }
                }
                    // Box is clicked and outlined
                if(pauseClick == false){
                    cell.className += (' ' + 'clicked')
                    cell.style.border = '2px solid black'

                    /* ====================
                    Check surrounding cells
                    ==================== */
                    // Getting ID of box clicked
                    let checkKey, checkValue
                    if(cell.id.length == 4){
                        checkKey = +cell.id.charAt(0)
                        checkValue = +cell.id.charAt(3)
                    }
                    else if(cell.id.length == 5){
                        // If checkKey is the single digit
                        if(cell.id.charAt(1) == ':'){
                            checkKey = +cell.id.charAt(0)
                            checkValue = +(cell.id.charAt(3) + cell.id.charAt(4))
                        }
                        // If checkKey is the double digit
                        else{
                            checkKey = +(cell.id.charAt(0) + cell.id.charAt(1))
                            checkValue = +cell.id.charAt(4)
                        }
                    }
                    else{
                        checkKey = +(cell.id.charAt(0) + cell.id.charAt(1))
                        checkValue = +(cell.id.charAt(4) + cell.id.charAt(5))
                    }

                    // Now we have checkKey and checkValue, we need to test all the cells around them
                    let currentCell = document.getElementById(`${checkKey}: ${checkValue}`)
                    let checkCellAbove = document.getElementById('dummyid')
                    let checkCellRight = document.getElementById('dummyid')
                    let checkCellBelow = document.getElementById('dummyid')
                    let checkCellLeft = document.getElementById('dummyid')
                    if(checkKey > 1) checkCellAbove = document.getElementById(`${checkKey-1}: ${checkValue}`)
                    if(checkValue < numOfCol) checkCellRight = document.getElementById(`${checkKey}: ${checkValue+1}`)
                    if(checkKey < numOfRow) checkCellBelow = document.getElementById(`${checkKey+1}: ${checkValue}`)
                    if(checkValue > 1) checkCellLeft = document.getElementById(`${checkKey}: ${checkValue-1}`)

                    if(checkCellAbove.classList.contains('clicked')){
                        currentCell.style.borderTop = 'none'
                        checkCellAbove.style.borderBottom = 'none'
                    }
                    if(checkCellRight.classList.contains('clicked')){
                        currentCell.style.borderRight = 'none'
                        checkCellRight.style.borderLeft = 'none'
                    }
                    if(checkCellBelow.classList.contains('clicked')){
                        currentCell.style.borderBottom = 'none'
                        checkCellBelow.style.borderTop = 'none'
                    }
                    if(checkCellLeft.classList.contains('clicked')){
                        currentCell.style.borderLeft = 'none'
                        checkCellLeft.style.borderRight = 'none'
                    }
                }
                pauseClick = false               
            }
        }
    }
}

function createLabel(){
    let labelText = document.getElementById('labelCreator').value
    if(!labelText) return
    document.getElementById('labelCreator').value = ''
    let container = document.getElementById("grid")
    let label = document.createElement("div")
    label.innerHTML = labelText
    label.className = "label"
    label.style.top = `${labelY}px`
    label.style.left = `${labelX}px`
    label.onmousedown = _ => {
        document.getElementById(findSelectedLabel()).style.border = 'none'
        labels.forEach(x => {
            if(x.includes('selected')){
                x.pop()
            }
        })
        labels[label.id.charAt(0)].push('selected')
        label.style.border = '1px solid red'
    }
    container.appendChild(label)

    addLabelToObj(label, labelText)
}

function addLabelToObj(label, labelText){
    labels.push([labelIndex, labelText, labelX, labelY])
    label.id = `${labelIndex}: ${labelText}`
    if(labelIndex > 0) {
        document.getElementById(findSelectedLabel()).style.border = 'none'
        labels.forEach(x => {
            if(x.includes('selected')) x.pop()
        })
    }
    labels[labelIndex].push('selected')
    label.style.border = '1px solid red'

    labelIndex++
}

function findLabelX(){
    let selectedObj, selected
    selectedObj = labels.filter(x => x.includes('selected'))
    selected = selectedObj[0][2]
    return selected
}

function findLabelY(){
    let selectedObj, selected
    selectedObj = labels.filter(x => x.includes('selected'))
    selected = selectedObj[0][3]
    return selected
}

function findSelectedLabel(){
    let selectedObj, selected = []
    selectedObj = labels.filter(x => x.includes('selected'))
    if(selectedObj == undefined) console.log(selectedObj)
    selected.push(selectedObj[0][0])
    selected.push(selectedObj[0][1])
    selected = selected.join(': ')
    return selected
}

function moveLabelUp(selected){
    document.getElementById(selected).style.top = `${labelY}px`
    labels[document.getElementById(selected).id.charAt(0)].splice(2, 1, labelX)
    labels[document.getElementById(selected).id.charAt(0)].splice(3, 1, labelY)
}

function moveLabelRight(selected){
    document.getElementById(selected).style.left = `${labelX}px`
    labels[document.getElementById(selected).id.charAt(0)].splice(2, 1, labelX)
    labels[document.getElementById(selected).id.charAt(0)].splice(3, 1, labelY)
}

function moveLabelDown(selected){
    document.getElementById(selected).style.top = `${labelY}px`
    labels[document.getElementById(selected).id.charAt(0)].splice(2, 1, labelX)
    labels[document.getElementById(selected).id.charAt(0)].splice(3, 1, labelY)

}

function moveLabelLeft(selected){
    document.getElementById(selected).style.left = `${labelX}px`
    labels[document.getElementById(selected).id.charAt(0)].splice(2, 1, labelX)
    labels[document.getElementById(selected).id.charAt(0)].splice(3, 1, labelY)
}