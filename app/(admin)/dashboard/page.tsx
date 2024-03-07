'use server'

import { redirect } from 'next/navigation'

const Dashboard = () => {
  return redirect('/dashboard/users')
}

export default Dashboard
