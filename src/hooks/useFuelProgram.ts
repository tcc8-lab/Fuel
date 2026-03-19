'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Agent, Job, demoAgents, demoJobs, demoProviders, demoTreasury, type TreasuryStats } from '@/lib/demo-data';
import { generateId, sleep } from '@/lib/utils';

// Simulated devnet interactions — these would use the real SDK in production
export function useFuelProgram() {
  const { publicKey, connected } = useWallet();
  const [agents, setAgents] = useState<Agent[]>(demoAgents);
  const [jobs, setJobs] = useState<Job[]>(demoJobs);
  const [treasury, setTreasury] = useState<TreasuryStats>(demoTreasury);
  const [loading, setLoading] = useState(false);

  const createAgent = useCallback(async (name: string) => {
    setLoading(true);
    await sleep(1500); // Simulate tx confirmation
    const newAgent: Agent = {
      id: `agt_${generateId()}`,
      name,
      owner: publicKey?.toBase58().slice(0, 4) + '...' + publicKey?.toBase58().slice(-4) || 'unknown',
      creditBalance: 0,
      totalSpent: 0,
      jobsCompleted: 0,
      status: 'idle',
      createdAt: new Date().toISOString(),
    };
    setAgents((prev) => [...prev, newAgent]);
    setLoading(false);
    return newAgent;
  }, [publicKey]);

  const topUpCredits = useCallback(async (agentId: string, amount: number) => {
    setLoading(true);
    await sleep(1200);
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, creditBalance: a.creditBalance + amount, status: 'active' as const }
          : a
      )
    );
    setLoading(false);
  }, []);

  const allocateJobBudget = useCallback(async (agentId: string, providerId: string, credits: number) => {
    setLoading(true);
    await sleep(1500);
    const newJob: Job = {
      id: `job_${generateId()}`,
      agentId,
      providerId,
      creditsAllocated: credits,
      creditsUsed: 0,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, creditBalance: a.creditBalance - credits }
          : a
      )
    );
    setJobs((prev) => [...prev, newJob]);
    setLoading(false);
    return newJob;
  }, []);

  const simulateProviderRoute = useCallback(async (jobId: string) => {
    setLoading(true);
    await sleep(2000);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: 'running' as const } : j
      )
    );
    setLoading(false);
  }, []);

  const submitUsageReceipt = useCallback(async (jobId: string, creditsUsed: number) => {
    setLoading(true);
    await sleep(1200);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, creditsUsed } : j
      )
    );
    setLoading(false);
  }, []);

  const settleJob = useCallback(async (jobId: string) => {
    setLoading(true);
    await sleep(1800);
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        return { ...j, status: 'settled' as const, settledAt: new Date().toISOString() };
      })
    );
    // Refund unused credits and update treasury
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const refund = job.creditsAllocated - job.creditsUsed;
      const fee = Math.floor(job.creditsUsed * 0.025);
      setAgents((prev) =>
        prev.map((a) =>
          a.id === job.agentId
            ? {
                ...a,
                creditBalance: a.creditBalance + refund,
                totalSpent: a.totalSpent + job.creditsUsed,
                jobsCompleted: a.jobsCompleted + 1,
              }
            : a
        )
      );
      setTreasury((prev) => ({
        ...prev,
        totalFees: prev.totalFees + fee,
        stakerRewards: prev.stakerRewards + Math.floor(fee * 0.5),
        protocolReserve: prev.protocolReserve + Math.floor(fee * 0.5),
      }));
    }
    setLoading(false);
  }, [jobs]);

  return {
    connected,
    publicKey,
    agents,
    jobs,
    providers: demoProviders,
    treasury,
    loading,
    createAgent,
    topUpCredits,
    allocateJobBudget,
    simulateProviderRoute,
    submitUsageReceipt,
    settleJob,
  };
}
