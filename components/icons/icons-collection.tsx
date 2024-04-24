import {
  AlignLeft,
  AlignRight,
  Archive,
  BookOpen,
  CreditCard,
  DollarSign,
  FileText,
  Folder,
  Grid,
  Home,
  LogOut,
  PieChart,
  TrendingDown,
  TrendingUp,
  User,
} from 'react-feather'

export const IconsCollection = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'pie-chart-icon':
      return <PieChart width={18} height={18} />

    case 'home-icon':
      return <Home width={18} height={18} />

    case 'file-text-icon':
      return <FileText width={18} height={18} />

    case 'folder-icon':
      return <Folder width={18} height={18} />

    case 'user-icon':
      return <User width={18} height={18} />

    case 'align-left-icon':
      return <AlignLeft width={18} height={18} />

    case 'align-right-icon':
      return <AlignRight width={18} height={18} />

    case 'archive-icon':
      return <Archive width={18} height={18} />

    case 'book-open-icon':
      return <BookOpen width={18} height={18} />

    case 'dollar-sign-icon':
      return <DollarSign width={18} height={18} />

    case 'trending-up-icon':
      return <TrendingUp width={18} height={18} />

    case 'trending-down-icon':
      return <TrendingDown width={18} height={18} />

    case 'credit-card-icon':
      return <CreditCard width={18} height={18} />

    case 'grid-icon':
      return <Grid width={18} height={18} />

    case 'logout-icon':
      return <LogOut width={18} height={18} />

    default:
      return <span className='w-[25px]'></span>
  }
}
