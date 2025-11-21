import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, CheckCircle2, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScanNfc } from "@/lib/api";
import type { Student } from "@shared/schema";
import { toast } from "sonner";

interface ScannerProps {
  courseId: number;
  sessionId: string;
  onClose: () => void;
  onScanned: (student: Student) => void;
}

export function Scanner({ courseId, sessionId, onClose, onScanned }: ScannerProps) {
  const [scanningState, setScanningState] = useState<"idle" | "scanning" | "success" | "error">("scanning");
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const scanMutation = useScanNfc();

  // Simulate NFC Scanning Event
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " && scanningState === "scanning") {
        // Simulate a scan on Spacebar press for demo purposes
        simulateScan();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [scanningState]);

  const simulateScan = async () => {
    // Randomly pick a student for demo
    const mockNfcIds = ["nfc_001", "nfc_002", "nfc_003", "nfc_004", "nfc_005"];
    const randomId = mockNfcIds[Math.floor(Math.random() * mockNfcIds.length)];

    try {
      const result = await scanMutation.mutateAsync({
        nfcId: randomId,
        courseId,
        sessionId,
      });

      setScanningState("success");
      setScannedStudent(result.student);
      onScanned(result.student);

      // Reset after 2 seconds to allow next scan
      setTimeout(() => {
        setScanningState("scanning");
        setScannedStudent(null);
      }, 2500);
    } catch (error: any) {
      toast.error(error.message || "Failed to scan NFC card");
      setScanningState("error");
      setTimeout(() => setScanningState("scanning"), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sidebar/95 backdrop-blur-sm p-6">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-6 right-6 text-white/60 hover:text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X size={32} />
      </Button>

      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <h2 className="text-3xl font-heading font-bold mb-2">Ready to Scan</h2>
          <p className="text-white/60">Hold student ID card near the back of device</p>
        </motion.div>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Pulse Rings */}
        {scanningState === "scanning" && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 nfc-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 nfc-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 nfc-pulse" style={{ animationDelay: "1s" }} />
          </>
        )}

        {/* Central Icon */}
        <AnimatePresence mode="wait">
          {scanningState === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-10 bg-accent/20 p-8 rounded-full backdrop-blur-md border border-accent/50"
            >
              <Wifi size={64} className="text-accent animate-pulse" />
            </motion.div>
          )}

          {scanningState === "success" && scannedStudent && (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative z-10 bg-green-500/20 p-2 rounded-full backdrop-blur-md border border-green-500/50"
            >
               <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-green-500 relative">
                  <img src={scannedStudent.avatar || undefined} alt={scannedStudent.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                    <CheckCircle2 size={48} className="text-white drop-shadow-md" />
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 h-24 flex items-center justify-center w-full max-w-md">
         <AnimatePresence mode="wait">
            {scanningState === "success" && scannedStudent ? (
               <motion.div
                key="student-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center bg-white/10 p-4 rounded-xl border border-white/10 w-full"
               >
                  <h3 className="text-xl font-bold text-white">{scannedStudent.name}</h3>
                  <p className="text-accent font-mono">{scannedStudent.studentId}</p>
                  <div className="flex items-center justify-center gap-2 mt-1 text-green-400 text-sm font-medium">
                    <CheckCircle2 size={14} /> Attendance Recorded
                  </div>
               </motion.div>
            ) : (
              <motion.div
                key="instruction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/40 flex flex-col items-center gap-2"
              >
                 <Smartphone size={24} />
                 <span className="text-sm">Tap screen or Press Space to simulate</span>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
