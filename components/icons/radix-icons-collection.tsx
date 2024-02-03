import * as Radix from '@radix-ui/react-icons'

export const IconsCollection = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'home-icon':
      return <Radix.HomeIcon width={25} height={25} />

    case 'dashboard-icon':
      return <Radix.DashboardIcon width={25} height={25} />

    case 'avatar-icon':
      return <Radix.AvatarIcon width={25} height={25} />

    case 'exit-icon':
      return <Radix.ExitIcon width={25} height={25} />

    default:
      return <Radix.PaddingIcon width={25} height={25} />
  }
}
