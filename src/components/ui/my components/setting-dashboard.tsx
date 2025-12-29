import { supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Command } from '../command';
import { Button } from '../button';
import { LogOut, Mail, Shield, User } from 'lucide-react';
import { SidebarComponent } from './sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import useUser from '@/hooks/useUser';

function SettingsDash() {
      const router = useRouter();
      const { user, loading } = useUser();

      const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/signin");
      };

      if (loading) return null;

  return (
    <div>
       <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="lg:hidden flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold">
          <Command className="h-5 w-5" /> Observo
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-zinc-500" />
        </Button>
      </div>

      <div className="flex">
        <SidebarComponent onLogoutAction={handleLogout} />

        <main className="flex-1 lg:pl-64 min-h-screen transition-all duration-300">
          <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Account Settings
              </h1>
              <p className="text-sm text-zinc-400">
                Manage your profile and account preferences.
              </p>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Your personal account details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    {user?.email?.[0].toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg">
                      {user?.email?.split("@")[0]}
                    </h3>
                    <p className="text-sm text-zinc-400">Free Plan</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 p-4 rounded-lg bg-zinc-950 border border-zinc-800/50">
                    <label className="text-xs font-medium text-zinc-500 uppercase flex items-center gap-2">
                      <Mail className="h-3 w-3" /> Email Address
                    </label>
                    <p className="text-sm font-mono text-zinc-200">
                      {user?.email}
                    </p>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-zinc-950 border border-zinc-800/50">
                    <label className="text-xs font-medium text-zinc-500 uppercase flex items-center gap-2">
                      <Shield className="h-3 w-3" /> User ID
                    </label>
                    <p
                      className="text-sm font-mono text-zinc-200 truncate"
                      title={user?.id}
                    >
                      {user?.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-zinc-100">
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingsDash
