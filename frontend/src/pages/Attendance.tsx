import { useState } from 'react';
import { Clock, Play, Square, Coffee, Download, Filter, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Attendance() {
  const [clockedIn, setClockedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  const handleClockInOut = () => {
    if (onBreak) setOnBreak(false);
    setClockedIn(!clockedIn);
  };

  const handleBreak = () => {
    if (clockedIn) {
      setOnBreak(!onBreak);
    }
  };

  const attendanceLogs = [
    { date: '2023-10-25', in: '09:00 AM', out: '05:30 PM', hours: '8.5h', status: 'Present', overTime: '0.5h' },
    { date: '2023-10-24', in: '09:15 AM', out: '05:00 PM', hours: '7.75h', status: 'Late', overTime: '0' },
    { date: '2023-10-23', in: '08:50 AM', out: '06:00 PM', hours: '9.1h', status: 'Present', overTime: '1.1h' },
    { date: '2023-10-22', in: '-', out: '-', hours: '0', status: 'On Leave', overTime: '0' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your daily working hours and breaks.</p>
        </div>
        <div className="flex space-x-2">
          <button className="h-9 px-4 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clock In Widget */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col items-center justify-center">
          <div className="text-4xl font-mono font-bold tracking-tight mb-2">09:41 AM</div>
          <p className="text-muted-foreground text-sm mb-8">Wednesday, Oct 25, 2023</p>
          
          <div className="flex gap-4 w-full max-w-[250px]">
            <button 
              onClick={handleClockInOut}
              className={cn(
                "flex-1 h-12 rounded-lg flex items-center justify-center font-medium transition-colors text-white",
                clockedIn ? "bg-destructive hover:bg-destructive/90" : "bg-green-600 hover:bg-green-700"
              )}
            >
              {clockedIn ? <Square className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {clockedIn ? 'Clock Out' : 'Clock In'}
            </button>
            <button 
              onClick={handleBreak}
              disabled={!clockedIn}
              className={cn(
                "flex-1 h-12 rounded-lg flex items-center justify-center font-medium transition-colors border-2",
                !clockedIn ? "opacity-50 cursor-not-allowed border-muted bg-muted" : 
                onBreak ? "border-yellow-500 text-yellow-600 bg-yellow-50" : "border-border hover:bg-muted"
              )}
            >
              <Coffee className="w-5 h-5 mr-2" />
              {onBreak ? 'Resume' : 'Break'}
            </button>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-8 w-full text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Clock In Time</p>
              <p className="font-semibold">{clockedIn ? '09:00 AM' : '--:--'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Hours</p>
              <p className="font-semibold">{clockedIn ? '0h 41m' : '--:--'}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Present Days</p>
              <h3 className="text-3xl font-bold">18</h3>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Target: 22 days this month</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Late Arrivals</p>
              <h3 className="text-3xl font-bold text-yellow-600">2</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Grace period is 15 mins</p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Overtime</p>
              <h3 className="text-3xl font-bold text-green-600">4.5h</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Approved this month</p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Working Hours</p>
              <h3 className="text-3xl font-bold">8.2h</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Per day</p>
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold">Recent Logs</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-sm border border-input rounded-md hover:bg-muted font-medium transition-colors flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </button>
            <button className="px-3 py-1.5 text-sm border border-input rounded-md hover:bg-muted font-medium transition-colors flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Clock In</th>
                <th className="px-6 py-4">Clock Out</th>
                <th className="px-6 py-4">Total Hours</th>
                <th className="px-6 py-4">Overtime</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendanceLogs.map((log, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{log.date}</td>
                  <td className="px-6 py-4">{log.in}</td>
                  <td className="px-6 py-4">{log.out}</td>
                  <td className="px-6 py-4">{log.hours}</td>
                  <td className="px-6 py-4">{log.overTime}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                      log.status === 'Present' ? "bg-green-100 text-green-700" :
                      log.status === 'Late' ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
