/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

class MilestoneDiagram {
    static MIN_PADDING_TOP = 10;
    static MIN_PADDING_LEFT = 10;
    
    static DEFAULT_COLOR = 'grey';

    //static CIRCLE_RADIUS = 9;
    //static CIRCLE_OFFSET_X = 12;
    //static CIRCLE_OFFSET_Y = 12;
    //static DIAMOND_SIZE = 15;
    //static DONUT_THICKNESS = 5;
    //static SQUARE_SIZE = 18;

    constructor(canvasElem, actions) {
        this.canvasElem = canvasElem;
        this.actions = actions;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW COMPONENTS */
    // Draw main
    draw(groupMap, configuration) {
        // Extract the group, no grouping in this mod so just get the null key
        let groupData = groupMap[null];
        this.groupData = groupData;

        // Set the updated configuration
        this.configuration = configuration;

        // Get the data maps
        let milestoneMap = groupData.milestoneData;
        let sectionMap = groupData.sectionData;

        // Get the canvas element
        let canvasElem = this.canvasElem

        // Reset contents
        canvasElem.innerHTML = '';

        // Create milestone diagram element and append
        let milestoneDiagramElem = document.createElement('div');
        milestoneDiagramElem.classList.add("milestone-diagram");
        milestoneDiagramElem.classList.add(this.configuration.orientation);
        canvasElem.appendChild(milestoneDiagramElem);

        // Create an ordered array of sections
        let sections = [];
        for(let key in sectionMap) {
            sections.push(sectionMap[key]);
        }

        // Sort the array by sequence
        sections.sort((a, b) => {
            return a.sequence < b.sequence ? -1 : a.sequence == b.sequence ? 0 : 1
        });

        // Create an ordered milestone array for rendering
        let milestones = null;

        // If there are sections, use that to sort the milestones
        if(sections.length > 0) {
            milestones = this.createMilestoneArrayFromSections(milestoneMap, sections);
        }
        else {
            milestones = this.createMilestoneArrayFromMilestones(milestoneMap);
        }

        // Draw milestones and sections
        this.drawMilestones(milestones, sections, milestoneDiagramElem);

        // Append event handlers
        this.appendEventHandlers(canvasElem);

        // Set markable class if marking enabled
        if(configuration.marking != null) {
            milestoneDiagramElem.classList.add('markable');
        }
        else {
            milestoneDiagramElem.classList.remove('markable');
        }
    }

    // Draw all milestones and sections
    drawMilestones(milestones, sections, milestoneDiagramElem) {        
        for(let idx = 0; idx < milestones.length; idx++) {
            let thisMilestone = milestones[idx];
            let thisSection = null;
            if(sections.length > 0 && idx < milestones.length - 1) {
                thisSection = sections[idx];
            }
            let isInitial = idx == 0;
            let isTerminal = idx == milestones.length - 1;
            this.drawMilestone(thisMilestone, thisSection, milestoneDiagramElem, isInitial, isTerminal, milestones[idx + 1]);
        }
    }

    // Draw a single milestone and section
    drawMilestone(milestone, section, milestoneDiagramElem, isInitial, isTerminal, nextMilestone) {
        // Draw milestone element
        let milestoneElem = document.createElement('div');
        milestoneElem.classList.add('milestone');
        milestoneDiagramElem.appendChild(milestoneElem);

        // Draw graphic
        let milestoneGraphicElem = document.createElement('div');
        milestoneGraphicElem.classList.add('graphic');
        milestoneGraphicElem.classList.add(this.configuration.shape);
        milestoneElem.appendChild(milestoneGraphicElem);
        this.drawGraphicBlock(milestone, section, milestoneGraphicElem, isInitial, isTerminal, nextMilestone);

        // Draw data
        let milestoneDataElem = document.createElement('div');
        milestoneDataElem.classList.add('data');
        milestoneElem.appendChild(milestoneDataElem);
        this.drawDataBlock(milestone, milestoneDataElem);
    }
 
    // Draw the graphic block
    drawGraphicBlock(milestone, section, milestoneGraphicElem, isInitial, isTerminal, nextMilestone) {
        this.drawGraphicMilestone(milestone, milestoneGraphicElem);

        // Draw section connector and bar if not terminal
        if(isTerminal == false) {
            this.drawGraphicSection(section, milestoneGraphicElem, nextMilestone);
        }
    }

    // Draw graphic milestone icon
    drawGraphicMilestone(milestone, milestoneGraphicElem) {
        let configuration = this.configuration;

        // Create SVG
        let svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElem.classList.add('milestone');
        milestoneGraphicElem.appendChild(svgElem);

        let shapeElem = null;
        if(this.configuration.shape == 'circle' || this.configuration.shape == 'donut') {
            // Create Circle
            shapeElem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            svgElem.appendChild(shapeElem);
        }
        else if(this.configuration.shape == 'diamond' || this.configuration.shape == 'square') {
            // Create Rectangle
            shapeElem = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            svgElem.appendChild(shapeElem);
        }

        // Create function for setting color
        let setColor = function(milestone, shapeElem) {
            // Set shape color
            if(milestone.color != null) {
                shapeElem.setAttribute('stroke', milestone.color);
                shapeElem.setAttribute('fill', milestone.color);
            }
            else {
                shapeElem.setAttribute('stroke', MilestoneDiagram.DEFAULT_COLOR);
                shapeElem.setAttribute('fill', MilestoneDiagram.DEFAULT_COLOR);
            }
        }

        // Set the color
        setColor(milestone, shapeElem);

        // Setup marking if enabled for milestones
        if(configuration.marking != null && configuration.allowMilestoneMarking == true) {
            svgElem.classList.add('markable');

            svgElem.onclick = function(event) {
                event.stopPropagation();
                if(event.ctrlKey == true)
                    milestone.row.mark("Toggle");
                else
                    milestone.row.mark("Replace");                
            };

            svgElem.onmouseover = function(event) {
                if(milestone.row.isMarked() == false) {
                    shapeElem.setAttribute('stroke', configuration.marking.colorHexCode);
                    shapeElem.setAttribute('fill', configuration.marking.colorHexCode);
                }
            };
            
            svgElem.onmouseout = function(event) {
                if(milestone.row.isMarked() == false) {
                    setColor(milestone, shapeElem);
                }
            };
            
            // Set Marked class and color
            // This is done last to override any other style classes
            if(milestone.row.isMarked() == true) {
                shapeElem.setAttribute('stroke', configuration.marking.colorHexCode);
                shapeElem.setAttribute('fill', configuration.marking.colorHexCode);
            }
        }

        // Set element on object for rectangle marking check
        milestone.elem = shapeElem;
    }

    // Draw graphic section
    drawGraphicSection(section, milestoneGraphicElem, nextMilestone) {
        let configuration = this.configuration;

        let sectionConnectorElem = document.createElement('div');
        sectionConnectorElem.classList.add('section-connector');
        milestoneGraphicElem.appendChild(sectionConnectorElem);

        let sectionBarElem = document.createElement('div');
        sectionBarElem.classList.add('section-bar');
        sectionConnectorElem.appendChild(sectionBarElem);

        // Create function for setting color
        let setColor = function(section, sectionBarElem, nextMilestone) {
            if(section != null && section.color != null) {
                sectionBarElem.style.backgroundColor = section.color;
            }
            else if(nextMilestone != null && nextMilestone.color != null){
                sectionBarElem.style.backgroundColor = nextMilestone.color;
            }
            else {
                sectionBarElem.style.backgroundColor = MilestoneDiagram.DEFAULT_COLOR;
            }
        }

        // Set the color
        setColor(section, sectionBarElem, nextMilestone);

        // Section might be null of milestone sequencing is used
        if(section != null) {
            // Setup marking if enabled for sections
            if(configuration.marking != null && configuration.allowSectionMarking == true) {
                sectionBarElem.classList.add('markable');

                sectionBarElem.onclick = function(event) {
                    event.stopPropagation();
                    if(event.ctrlKey == true)
                        section.row.mark("Toggle");
                    else
                        section.row.mark("Replace");                
                };

                sectionBarElem.onmouseover = function(event) {
                    if(section.row.isMarked() == false) {
                        sectionBarElem.style.backgroundColor = configuration.marking.colorHexCode;
                    }
                };
                
                sectionBarElem.onmouseout = function(event) {
                    if(section.row.isMarked() == false) {
                        setColor(section, sectionBarElem, nextMilestone);
                    }
                };
                
                // Set Marked class and color
                // This is done last to override any other style classes
                if(section.row.isMarked() == true) {
                    sectionBarElem.style.backgroundColor = configuration.marking.colorHexCode;
                }
            }

            // Set element on object for rectangle marking check
            section.elem = sectionBarElem;
        }
    }

    // Draw the data block
    drawDataBlock(milestone, milestoneDataElem) {
        // Create milestone title
        let milestoneTitleElem = document.createElement('div');
        milestoneTitleElem.classList.add('milestone-title');
        milestoneTitleElem.classList.add('initial');
        milestoneDataElem.appendChild(milestoneTitleElem);
        milestoneTitleElem.innerHTML = milestone.displayName;

        // Create time block
        let timeBlockElem = document.createElement('div');
        timeBlockElem.classList.add('time-block');
        milestoneDataElem.appendChild(timeBlockElem);

        // Initialize time helper objects
        let times = {}
        let timeArr = ['planned', 'predicted', 'actual'];

        // Set times for activation
        times.planned = milestone.plannedActivationDateTime,
        times.predicted = milestone.predictedActivationDateTime,
        times.actual = milestone.actualActivationDateTime        
        this.drawTimes(timeBlockElem, timeArr, times, 
            this.configuration.delays.calcPredictedAct, 
            this.configuration.delays.calcActualAct);

        // Set times for release
        times.planned = milestone.plannedReleaseDateTime,
        times.predicted = milestone.predictedReleaseDateTime,
        times.actual = milestone.actualReleaseDateTime        
        this.drawTimes(timeBlockElem, timeArr, times, 
            this.configuration.delays.calcPredictedRel, 
            this.configuration.delays.calcActualRel);

    }

    // Draw the times in the data block
    drawTimes(timeBlockElem, timeArr, times, calcPred, calcAct) {
        let timesElem = document.createElement('div');
        timesElem.classList.add('times');
        timeBlockElem.appendChild(timesElem);

        let baseTime = times[timeArr[0]];
        for(let thisTime of timeArr) {
            let timeElem = document.createElement('div');
            timeElem.classList.add(thisTime);
            timeElem.classList.add('time');
            timesElem.appendChild(timeElem);

            let delta = '';
            // Skip the first time
            if(thisTime != timeArr[0]) {
                let calc = thisTime == 'predicted' ? calcPred : calcAct;
                let deltaUnits = this.configuration.deltaUnits;
                if(baseTime != null && times[thisTime] != null && calc == true) {
                    let response = this.calcDelta(baseTime, times[thisTime], this.configuration.deltaUnits);
                    timeElem.classList.add(response.delayClass);
                    delta = response.delta;
                }
            }

            let template = `
                <div>${Utility.formatTimestamp(times[thisTime], this.configuration.timeFormat)}</div>
                <div class="delta">${delta}</div>
            `;
            timeElem.innerHTML = template.trim();
        }
    }
 
    /* ---------------------------------------------------------------------------------------------------- */
    /* DATA FUNCTIONS */

    // Create a milestone array from a sorted list of sections
    // Milestone array will be an ordered list of milestones through the entire sequence
    createMilestoneArrayFromSections(milestoneMap, sections) {
        let milestones = [];
        for(let idx = 0; idx < sections.length; idx++) {
            let thisSection = sections[idx];
            let initialMilestone = milestoneMap[thisSection.initialMilestoneId];
            milestones.push(initialMilestone);

            if(idx == sections.length - 1) {
                let terminalMilestone = milestoneMap[thisSection.terminalMilestoneId];
                milestones.push(terminalMilestone);
            }
        }

        return milestones;
    }

    // Create a milestone array from all milestones
    // Milestone array will be an orderes list of milestones through the entire sequence 
    createMilestoneArrayFromMilestones(milestoneMap) {
        let milestones = []

        for(let key in milestoneMap) {
            let thisMilestone = milestoneMap[key];
            if(thisMilestone.sequence != null) {
                milestones.push(thisMilestone);
            }
        }

        // Sort the array by sequence
        milestones.sort((a, b) => {
            return a.sequence < b.sequence ? -1 : a.sequence == b.sequence ? 0 : 1
        });

        return milestones;
    }

    // Calculate the time delta between a base and target time using specified delta units
    calcDelta(baseTime, targetTime, deltaUnits) {
        let delta = Math.round((new Date(targetTime) - new Date(baseTime)) / 1000);
        let unit = 's';

        if(deltaUnits == 'Default') {
            if(Math.abs(delta) > 60) {
                delta = Math.round(delta / 60);
                unit = 'm';
            }
            if(Math.abs(delta) > 60) {
                delta = Math.round(delta / 60);
                unit = 'h';
            }
            if(Math.abs(delta) > 24) {
                delta = Math.round(delta / 24);
                unit = 'd';
            }
        }
        else if(deltaUnits == 'Seconds') {
            delta = delta;
            unit = 's';
        }
        else if(deltaUnits == 'Minutes') {
            delta = Math.round(delta / 60);
            unit = 'm';
        }
        else if(deltaUnits == 'Hours') {
            delta = Math.round(delta / (60 * 60));
            unit = 'h';
        }
        else if(deltaUnits == 'Days') {
            delta = Math.round(delta / (60 * 60 * 24));
            unit = 'd';
        }
        else {
            delta = '??';
        }

        let delayClass = '';
        if(delta > 0)
            delayClass = 'delayed';
        else if(delta == 0)
            delayClass = 'on-time';
        else if(delta < 0)
            delayClass = 'early';

        if(delta >= 0) 
            delta = '+' + delta;
        delta += unit;

        let response = {
            delayClass: delayClass,
            delta: delta
        }

        return response;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* EVENTS */

    // Append event handlers
    appendEventHandlers(canvasElem) {
        let self = this;

        // Append click handler for diagram clicks
        canvasElem.onclick = function(event) {
            event.stopPropagation();
            self.actions.clearAllMarking();
        };
    }

    // Rectangular selection
    rectangleSelection(selection) {
        let configuration = this.configuration;
        let groupData = this.groupData;

        let selectedArr = [];
        if(configuration.allowMilestoneMarking == true) {
            for(let key in groupData.milestoneData) {
                let thisMilestone = groupData.milestoneData[key];
                
                let lineRect = thisMilestone.elem.getBoundingClientRect();
                let match = Utility.rectangleOverlap(selection.rect, lineRect);
                if(match == true) {
                    selectedArr.push(thisMilestone.row);   
                }
            }
        }
        
        if(configuration.allowSectionMarking == true) {
            for(let key in groupData.sectionData) {
                let thisSection = groupData.sectionData[key];
                
                let lineRect = thisSection.elem.getBoundingClientRect();
                let match = Utility.rectangleOverlap(selection.rect, lineRect);
                if(match == true) {
                    selectedArr.push(thisSection.row);   
                }
            }
        }
        
        return selectedArr;
    }

}

