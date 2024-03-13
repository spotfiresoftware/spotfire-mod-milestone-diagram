/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

class Milestone {
    constructor(displayName, color, milestoneId, sequence, plannedActivationDateTime, plannedReleaseDateTime, predictedActivationDateTime, predictedReleaseDateTime, actualActivationDateTime, actualReleaseDateTime, row) {
        this.displayName = displayName;
        this.color = color;
        this.milestoneId = milestoneId;
        this.sequence = sequence;
        this.plannedActivationDateTime = plannedActivationDateTime;
        this.plannedReleaseDateTime = plannedReleaseDateTime;
        this.predictedActivationDateTime = predictedActivationDateTime;
        this.predictedReleaseDateTime = predictedReleaseDateTime;
        this.actualActivationDateTime = actualActivationDateTime;
        this.actualReleaseDateTime = actualReleaseDateTime;
        this.row = row;
    }
}

class Section {
    constructor(displayName, color, sequence, initialMilestoneId, terminalMilestoneId, row) {
        this.displayName = displayName;
        this.color = color;
        this.sequence = sequence;
        this.initialMilestoneId = initialMilestoneId;
        this.terminalMilestoneId = terminalMilestoneId;
        this.row = row;
    }
}
