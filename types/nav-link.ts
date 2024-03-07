export type NavLinkGroup = {
  id: string
  links: NavLink[]
}

export type NavLink = {
  id: string
  href: string
  icon?: string
  title: string
}
