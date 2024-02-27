export type NavLinkGroup = {
  id: string
  links: Link[]
}

export type Link = {
  id: string
  href: string
  icon?: string
  title: string
}
