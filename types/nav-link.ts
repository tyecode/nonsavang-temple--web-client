export type NavLinkGroup = {
  [x: string]: any
  id: string
  title: string
  links: NavLink[]
}

export type NavLink = {
  id: string
  href: string
  icon?: string
  title: string
}
