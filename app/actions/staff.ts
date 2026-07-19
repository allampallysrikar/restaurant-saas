"use server";

// app/actions/staff.ts
// Enterprise HR, Shift Management, PIN Timeclock & Tip Pool Calculator

export interface StaffMember {
  id: string;
  name: string;
  role: "SERVER" | "SOMMELIER" | "HEAD_CHEF" | "LINE_COOK" | "BUSSER" | "BARTENDER" | "MANAGER";
  pin: string; // 4-digit PIN for clock-in/out and override
  hourlyRate: number;
  tipPoolPoints: number; // Front of house get more points, or custom weights
  department: "FOH" | "BOH" | "MGMT";
  status: "CLOCKED_IN" | "CLOCKED_OUT" | "ON_BREAK";
  currentShiftStart?: string;
  hoursWorkedToday: number;
}

let staffStore: StaffMember[] = [
  { id: "staff-1", name: "Marcus Aurelius", role: "SERVER", pin: "1111", hourlyRate: 15.00, tipPoolPoints: 10, department: "FOH", status: "CLOCKED_IN", currentShiftStart: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(), hoursWorkedToday: 4.5 },
  { id: "staff-2", name: "Elena Rostova", role: "SOMMELIER", pin: "2222", hourlyRate: 24.00, tipPoolPoints: 12, department: "FOH", status: "CLOCKED_IN", currentShiftStart: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), hoursWorkedToday: 5.0 },
  { id: "staff-3", name: "Chef Gordon Ramsay (Demo)", role: "HEAD_CHEF", pin: "3333", hourlyRate: 45.00, tipPoolPoints: 8, department: "BOH", status: "CLOCKED_IN", currentShiftStart: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), hoursWorkedToday: 6.0 },
  { id: "staff-4", name: "Leo Vance", role: "BUSSER", pin: "4444", hourlyRate: 14.00, tipPoolPoints: 6, department: "FOH", status: "CLOCKED_IN", currentShiftStart: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), hoursWorkedToday: 4.0 },
  { id: "staff-5", name: "Sara Jenkins", role: "LINE_COOK", pin: "5555", hourlyRate: 21.00, tipPoolPoints: 7, department: "BOH", status: "CLOCKED_OUT", hoursWorkedToday: 0 },
  { id: "staff-6", name: "David Miller", role: "BARTENDER", pin: "6666", hourlyRate: 18.00, tipPoolPoints: 9, department: "FOH", status: "ON_BREAK", currentShiftStart: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(), hoursWorkedToday: 3.5 },
  { id: "staff-7", name: "Victoria Sterling", role: "MANAGER", pin: "1234", hourlyRate: 35.00, tipPoolPoints: 0, department: "MGMT", status: "CLOCKED_IN", currentShiftStart: new Date(Date.now() - 7 * 3600 * 1000).toISOString(), hoursWorkedToday: 7.0 },
];

export async function getStaffList(): Promise<StaffMember[]> {
  return staffStore;
}

export async function punchTimeclock(pin: string): Promise<{ success: boolean; action?: string; member?: StaffMember; error?: string }> {
  const member = staffStore.find(s => s.pin === pin);
  if (!member) {
    return { success: false, error: "Invalid 4-digit PIN. Staff member not found." };
  }

  if (member.status === "CLOCKED_OUT") {
    member.status = "CLOCKED_IN";
    member.currentShiftStart = new Date().toISOString();
    return { success: true, action: "CLOCKED_IN", member };
  } else if (member.status === "CLOCKED_IN") {
    // Clock out and add hours
    if (member.currentShiftStart) {
      const elapsedHours = (Date.now() - new Date(member.currentShiftStart).getTime()) / (3600 * 1000);
      member.hoursWorkedToday = Number((member.hoursWorkedToday + Math.max(0.1, elapsedHours)).toFixed(2));
    }
    member.status = "CLOCKED_OUT";
    delete member.currentShiftStart;
    return { success: true, action: "CLOCKED_OUT", member };
  } else {
    // If on break, return to clocked in
    member.status = "CLOCKED_IN";
    return { success: true, action: "CLOCKED_IN (Returned from Break)", member };
  }
}

export async function calculateTipPoolDistribution(totalDailyTips: number, fohSplitPercent: number = 70): Promise<{
  totalTips: number;
  fohPool: number;
  bohPool: number;
  payouts: { staffId: string; name: string; role: string; department: string; hoursWorked: number; tipPoints: number; tipPayout: number; totalEarnings: number }[];
}> {
  const fohStaff = staffStore.filter(s => s.department === "FOH" && s.hoursWorkedToday > 0);
  const bohStaff = staffStore.filter(s => s.department === "BOH" && s.hoursWorkedToday > 0);

  const fohPool = Number((totalDailyTips * (fohSplitPercent / 100)).toFixed(2));
  const bohPool = Number((totalDailyTips - fohPool).toFixed(2));

  // Total weighted points (hoursWorked * tipPoolPoints)
  const totalFohWeighted = fohStaff.reduce((acc, s) => acc + (s.hoursWorkedToday * s.tipPoolPoints), 0) || 1;
  const totalBohWeighted = bohStaff.reduce((acc, s) => acc + (s.hoursWorkedToday * s.tipPoolPoints), 0) || 1;

  const payouts = staffStore
    .filter(s => s.hoursWorkedToday > 0 && s.department !== "MGMT")
    .map(s => {
      let tipPayout = 0;
      if (s.department === "FOH") {
        const share = (s.hoursWorkedToday * s.tipPoolPoints) / totalFohWeighted;
        tipPayout = Number((fohPool * share).toFixed(2));
      } else if (s.department === "BOH") {
        const share = (s.hoursWorkedToday * s.tipPoolPoints) / totalBohWeighted;
        tipPayout = Number((bohPool * share).toFixed(2));
      }

      const basePay = Number((s.hoursWorkedToday * s.hourlyRate).toFixed(2));
      return {
        staffId: s.id,
        name: s.name,
        role: s.role,
        department: s.department,
        hoursWorked: s.hoursWorkedToday,
        tipPoints: s.tipPoolPoints,
        tipPayout,
        totalEarnings: Number((basePay + tipPayout).toFixed(2))
      };
    });

  return { totalTips: totalDailyTips, fohPool, bohPool, payouts };
}
