import {
  AlignLeft,
  AlignRight,
  Archive,
  BookOpen,
  CreditCard,
  DollarSign,
  Folder,
  Grid,
  LogOut,
  PieChart,
  TrendingDown,
  TrendingUp,
  User,
} from 'react-feather'

export const IconsCollection = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'pie-chart-icon':
      return <PieChart width={20} height={20} />

    case 'folder-icon':
      return <Folder width={20} height={20} />

    case 'user-icon':
      return <User width={20} height={20} />

    case 'align-left-icon':
      return <AlignLeft width={20} height={20} />

    case 'align-right-icon':
      return <AlignRight width={20} height={20} />

    case 'archive-icon':
      return <Archive width={20} height={20} />

    case 'book-open-icon':
      return <BookOpen width={20} height={20} />

    case 'dollar-sign-icon':
      return <DollarSign width={20} height={20} />

    case 'trending-up-icon':
      return <TrendingUp width={20} height={20} />

    case 'trending-down-icon':
      return <TrendingDown width={20} height={20} />

    case 'credit-card-icon':
      return <CreditCard width={20} height={20} />

    case 'grid-icon':
      return <Grid width={20} height={20} />

    case 'logout-icon':
      return <LogOut width={20} height={20} />

    default:
      return <span className='w-[25px]'></span>
  }
}
