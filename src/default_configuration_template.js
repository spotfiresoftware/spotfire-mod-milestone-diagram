/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

const defaultConfigurationTemplate = {
    "label": "Display",
    "rowLimit": {
        "label": "Row Limit",
        "datatype": "int",
        "minVal": 0
    },
    "trellisDirection": {
        "label": "Trellis Direction",
        "datatype": "string",
        "enumeration": [
            "Rows",
            "Columns"
        ]
    },
    "maxTrellisCount": {
        "label": "Max Trellis Panel Count",
        "datatype": "int",
        "minVal": 0
    },
    "diagram": {
    	"label": "Milestone Diagram",
        "allowMilestoneMarking": {
            "label": "Allow Milestone Marking",
            "datatype": "boolean"
        },
        "allowSectionMarking": {
            "label": "Allow Section Marking",
            "datatype": "boolean"
        },
        "delays": {
            "calcPredictedAct": {
                "label": "Calc Predicted Activation Delay",
                "datatype": "boolean"
            },
            "calcPredictedRel": {
                "label": "Calc Predicted Release Delay",
                "datatype": "boolean"
            },
            "calcActualAct": {
                "label": "Calc Actual Activation Delay",
                "datatype": "boolean"
            },
            "calcActualRel": {
                "label": "Calc Actual Release Delay",
                "datatype": "boolean"
            }
        },
        "deltaUnits": {
            "label": "Delay Delta Units",
            "datatype": "string",
            "enumeration": [
                "Default",
                "Seconds",
                "Minutes",
                "Hours",
                "Days"
            ]
        },
        "orientation": {
            "label": "Diagram Orientation",
            "datatype": "string",
            "enumeration": [
                "Vertical",
                "Horizontal"
            ]
        },
        "shape": {
            "label": "Milestone Shape",
            "datatype": "string",
            "enumeration": [
                "Circle",
                "Diamond",
                "Donut", 
                "Square"
            ]
        },
        "timeFormat": {
            "label": "Time Format",
            "datatype": "string"
        }
    }    
}
