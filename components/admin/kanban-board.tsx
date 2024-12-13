import React from "react"
import { KanbanColumn, IntakesNotCompletedCard, IntakesSubmittedCard, SupplementalsNotCompletedCard, SupplementalsNeedingApprovalCard, OnboardingNotScheduledCard, OnboardingScheduledCard, OnboardingSubmittedCard, ReportsNeedingApprovalCard, DiscoveryNotScheduledCard, DiscoverySubmittedCard, DiscoveryWithoutNotesCard } from "./kanban-column"
import { discoveryCalls } from "@/utils/data/schedule/scheduled_events";
import { DateTime } from "luxon";

export const KanbanBoard = async ({ forms, reports }: { forms: any, reports: any }) => {

    const discoveryCall_data = await discoveryCalls();

    const onboardingWithoutNotes = async () => {

        let eventsWithoutNotes: any = [];
        
        if(!discoveryCall_data) return [];

        console.log("Retrieved discovery calls", discoveryCall_data);

        discoveryCall_data.forEach((event: any) => {
            console.log("Checking event", event);
            if(event.decrypted_notes.length == 0) {
                console.log("Event has no notes", event);
                if(DateTime.fromISO(event.start_time) < DateTime.now()) {
                    eventsWithoutNotes.push(event);
                }
            }
        });

        console.log("Discovery Calls without notes", eventsWithoutNotes);

        return eventsWithoutNotes;
    }

    const hasNotScheduledOnboarding = async () => {

        let eventsNotScheduled: any = [];
        
        if(!discoveryCall_data) return [];

        discoveryCall_data.forEach((event: any) => {
            if(event.status == "created") {
                eventsNotScheduled.push(event);
            }
        });

        return eventsNotScheduled;
    }

    const hasOnboardingNotesSubmitted = async () => {

        let eventsWithNotes: any = [];
        
        if(!discoveryCall_data) return [];

        discoveryCall_data.forEach((event: any) => {
            if(event.decrypted_notes.length > 0 && event.status != "submission_approved") {
                        eventsWithNotes.push(event);
            }
        });

        return eventsWithNotes;
    }

    const categorizedData = {
        intakesNotCompleted: forms.filter((form: any) => form.status === 'created' && form.type === 'intake'),
        intakesSubmitted: forms.filter((form: any) => form.status === 'submitted' && form.type === 'intake'),
        supplementalsNotCompleted: forms.filter((form: any) => form.status === 'created' && form.type === 'supplemental'),
        supplementalsNeedingApproval: forms.filter((form: any) => form.status === 'submitted' && form.type === 'supplemental'),
        onboardingNotScheduled: await hasNotScheduledOnboarding(),
        onboardingWithoutNotes: await onboardingWithoutNotes(),
        onboardingSubmitted: await hasOnboardingNotesSubmitted(),
        reportsNeedingApproval: reports,

    };

    const data = [
        { title: "Intakes Not Completed", data: categorizedData.intakesNotCompleted, cardComponent: IntakesNotCompletedCard },
        { title: "Intakes Submitted", data: categorizedData.intakesSubmitted, cardComponent: IntakesSubmittedCard },
        { title: "Supplementals Not Completed", data: categorizedData.supplementalsNotCompleted, cardComponent: SupplementalsNotCompletedCard },
        { title: "Supplementals Needing Approval", data: categorizedData.supplementalsNeedingApproval, cardComponent: SupplementalsNeedingApprovalCard },
        { title: "Discovery Not Scheduled", data: categorizedData.onboardingNotScheduled, cardComponent: DiscoveryNotScheduledCard },
        { title: "Discovery without Notes", data: categorizedData.onboardingWithoutNotes, cardComponent: DiscoveryWithoutNotesCard },
        { title: "Discovery Submitted", data: categorizedData.onboardingSubmitted, cardComponent: DiscoverySubmittedCard },
        { title: "Reports Needing Approval", data: categorizedData.reportsNeedingApproval, cardComponent: ReportsNeedingApprovalCard },
    ]

    return (
        <div className="flex flex-row divide-x-2 w-full h-[calc(100vh-250px)]">
            {data.map((column: any, index: any) => (
                <React.Fragment key={index}>
                    <KanbanColumn title={column.title} data={column.data} cardComponent={column.cardComponent} />
                </React.Fragment>
            ))}
        </div>
    )
}

export default KanbanBoard;