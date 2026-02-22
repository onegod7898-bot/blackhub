import { redirect } from 'next/navigation'

/** Hidden admin route - use /bh-portal instead of /admin. Not linked in public nav. */
export default function HiddenAdminPage() {
  redirect('/admin')
}
