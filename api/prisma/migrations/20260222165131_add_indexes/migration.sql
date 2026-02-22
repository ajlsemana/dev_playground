-- CreateIndex
CREATE INDEX "ActionLog_caseId_createdAt_idx" ON "ActionLog"("caseId", "createdAt");

-- CreateIndex
CREATE INDEX "Case_status_stage_dpd_idx" ON "Case"("status", "stage", "dpd");

-- CreateIndex
CREATE INDEX "Case_assignedTo_idx" ON "Case"("assignedTo");
