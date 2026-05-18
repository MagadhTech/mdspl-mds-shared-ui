import { Box, Flex, Icon, Input, Kbd, Portal, Text } from '@chakra-ui/react';
import {
  AlignVerticalDistributeEnd,
  BadgeIndianRupee,
  BaggageClaim,
  Banknote,
  BetweenHorizonalStart,
  BookCheck,
  BookCopy,
  Building2,
  CheckCheck,
  CircleStar,
  ClipboardCheck,
  ClipboardClock,
  ClipboardMinus,
  ClockAlert,
  Code,
  Codesandbox,
  Cylinder,
  Database,
  FileChartColumnIncreasing,
  FileStack,
  FlaskConical,
  FolderInput,
  FolderOpenDot,
  Fuel,
  Gift,
  Hash,
  Home,
  IndianRupee,
  KeyRound,
  Landmark,
  LandPlot,
  Layers,
  LayoutGrid,
  List,
  ListOrderedIcon,
  NotebookPen,
  PanelLeftOpen,
  ParkingCircle,
  Pin,
  Radiation,
  RectangleEllipsis,
  ScrollText,
  Search,
  Settings2,
  Shield,
  ShieldUser,
  ShoppingBag,
  SquareArrowRight,
  SquareChartGantt,
  TrendingUp,
  Truck,
  User,
  UserCog,
  Users,
  Van,
  Wallet2,
  Warehouse,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react'; // Added useRef

const SEARCH_CATEGORIES = [
  {
    title: 'EXTERNAL SERVICES',
    items: [
      { label: 'Rate', url: 'https://rate.mgdh.in', icon: TrendingUp },
      { label: 'Raw', url: 'https://raw.mgdh.in', icon: Layers },
      { label: 'Master', url: 'https://master.mgdh.in', icon: Database },
      { label: 'Bank', url: 'https://bank.mgdh.in', icon: Landmark },
      { label: 'Scroll', url: 'https://scroll.mgdh.in', icon: ScrollText },
      { label: 'Logistic', url: 'https://logistic-mds.mgdh.in/driver', icon: Truck },
      { label: 'Marketing', url: 'https://marketing.mgdh.in', icon: User },
      { label: 'Order', url: 'https://order.mgdh.in', icon: User },
    ],
  },
  {
    title: 'MASTER',
    items: [
      { label: 'Dashboard', url: '/profile', icon: Home },
      { label: 'User Management', url: '/users', icon: Users },
      { label: 'ERP User', url: '/erp-users', icon: Users },
      { label: 'OAuth Applications', url: '/oauth', icon: KeyRound },
      { label: 'Roles', url: '/roles/', icon: Shield },
      { label: 'Permissions', url: '/permissions', icon: Shield },
      {
        label: 'Products',
        url: '/products',
        icon: Codesandbox,
        children: [
          { label: 'Product List', url: '/products' },
          { label: 'Product Group', url: '/products/products-group' },
          { label: 'Product Sorting', url: '/products/product-sorting' },
        ],
      },
      {
        label: 'Categories',
        url: '/category',
        icon: BaggageClaim,
        children: [
          { label: 'Category List', url: '/category' },
          { label: 'Category Group', url: '/category/category-group' },
        ],
      },
      { label: 'District', url: '/district', icon: LandPlot },
      { label: 'Vehicle List', url: '/vehicle', icon: Truck },
      {
        label: 'Warehouse',
        url: '/warehouse',
        icon: Warehouse,
        children: [
          { label: 'Warehouse List', url: '/warehouse/' },
          { label: 'Store', url: '/warehouse/store' },
        ],
      },
      {
        label: 'Company',
        url: '/company',
        icon: Building2,
        children: [
          { label: 'Partner', url: '/company/partners' },
          { label: 'Partner Employee', url: '/company/partners-employee' },
          { label: 'Waste Partner', url: '/company/waste-partner' },
          { label: 'Raw Supplier', url: '/company/raw-supplier' },
          { label: 'Price Protection', url: '/company/price-protection' },
          { label: 'Customer Partner', url: '/company/customer-partner' },
          { label: 'Transporter', url: '/company/transporter' },
          { label: 'Marketing Officer', url: '/company/marketing' },
          { label: 'MO Groups', url: '/company/mo-group' },
        ],
      },
      {
        label: 'Notification',
        url: '/notification',
        icon: PanelLeftOpen,
        children: [
          { label: 'Channel List', url: '/notification/channel' },
          { label: 'Notification List', url: '/notification/notification-list' },
          { label: 'Notification Type ', url: '/notification/notification-type' },
          { label: 'Deliveries', url: '/notification/deliveries' },
          { label: 'Template', url: '/notification/templates' },
        ],
      },
      { label: 'Options', url: '/options', icon: Shield },
      { label: 'Pages', url: '/erp', icon: ClipboardCheck },
      { label: 'Devices', url: '/devices', icon: Pin },
      {
        label: 'OTP Purpose',
        url: '/otp-purpose',
        icon: RectangleEllipsis,
        children: [{ label: 'OTP List', url: '/otp-purpose' }],
      },
      { label: 'Logs', url: '/logs', icon: ClipboardCheck },
      { label: 'User Firebase', url: '/user-firebase', icon: User },
    ],
  },
  {
    title: 'RAW MATERIALS',
    items: [
      { label: 'PO Orders', url: '/billet/orders', icon: CircleStar },
      { label: 'Processing Entries', url: '/billet/processing-entries', icon: Van },
      { label: 'Completed Entries', url: '/billet/completed-entries', icon: CheckCheck },
      { label: 'Chemical Test', url: '/billet/chemical-test', icon: FlaskConical },
      { label: 'Builty Rate', url: '/billet/builty-rate', icon: IndianRupee },
      { label: 'Cash Accountant', url: '/billet/cash-accountant', icon: BetweenHorizonalStart },
    ],
  },
  {
    title: 'BANKING & SCROLL',
    items: [
      { label: 'Banking Report', url: '/banking-report', icon: ClipboardMinus },
      { label: 'Bank Beneficiary', url: '/bank-beneficiary', icon: Landmark },
      { label: 'Bank Transaction', url: '/bank-transcations', icon: FolderInput },
      { label: 'Van List', url: '/van-list', icon: ScrollText },
      { label: 'Bank Assign Types', url: '/bank-assign-types', icon: BookCheck },
      { label: 'Tally Ledgers', url: '/tally-ledgers', icon: BookCopy },
      { label: 'Scroll Transactions', url: '/scroll-transactions', icon: Banknote },
      { label: 'Petty Cash', url: '/petty-cash', icon: IndianRupee },
    ],
  },
  {
    title: 'ORDERS & MANAGEMENT',
    items: [
      { label: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
      { label: 'Cash Order', url: '/cashOrder/cash_order_list', icon: Banknote },
      { label: 'Partner Order', url: '/partnerOrder/partner_order_list', icon: Users },
      { label: 'Loading User', url: '/loadingUser/loading_user', icon: UserCog },
      {
        label: 'Waste PO',
        url: '/wasteOrder',
        icon: Radiation,
        children: [
          { label: 'Waste PO', url: '/wasteOrder/waste_po_list' },
          { label: 'Waste Order', url: '/wasteOrder/waste_order_list' },
        ],
      },
      { label: 'Order Billing', url: '/OrderBilling/order_billing', icon: NotebookPen },
      { label: 'Manual Invoice', url: '/ManualInvoice/manual_invoice', icon: SquareChartGantt },
      {
        label: 'Gift',
        url: '/gift',
        icon: Gift,
        children: [
          { label: 'Master List', url: '/gift/master_list/master_list' },
          { label: 'Entry List', url: '/gift/entry_list/entry_list' },
          { label: 'Gift Templates', url: '/gift/gift_templates/gift_templates' },
        ],
      },
      {
        label: 'Rewards',
        url: '/rewards',
        icon: Gift,
        children: [{ label: 'Gift Slabs', url: '/rewards/gift_slabs/gift_slabs' }],
      },
      {
        label: 'Performance Report',
        url: '/performanceReport/performance_report',
        icon: FileChartColumnIncreasing,
      },
      { label: 'Parking List', url: '/parking/parking-list', icon: ParkingCircle },
      { label: 'Vehicle List', url: '/vehicleList/vehicle-list', icon: Truck },
      {
        label: 'Report',
        url: '/report',
        icon: FileStack,
        children: [
          { label: 'Product Tally', url: '/productTally/productTally' },
          { label: 'Invoice Report', url: '/InvoiceReport/InvoiceReport' },
          { label: 'MO Order Report', url: '/MO_OrderReport/MO_OrderReport' },
        ],
      },
      { label: 'Manual Order', url: '/manualOrder/manualTMTOrder', icon: Settings2 },
      { label: 'Developer Config', url: '/dev/update_config', icon: Code },
    ],
  },
  {
    title: 'LOGISTICS',
    items: [
      { label: 'Driver', url: '/driver', icon: Users },
      { label: 'Attendance', url: '/attendance', icon: ShieldUser },
      { label: 'Cash Order', url: '/cash-order', icon: Banknote },
      { label: 'Order', url: '/order', icon: ListOrderedIcon },
      { label: 'Vehicle List', url: '/vehicle', icon: Truck },
      {
        label: 'Trip',
        url: '/trip',
        icon: Warehouse,
        children: [
          { label: 'Trip List', url: '/trip/trip-list' },
          { label: 'Builty List', url: '/trip/builty-list' },
        ],
      },
      {
        label: 'Vehicle Out',
        url: '/vehicle-out',
        icon: SquareArrowRight,
        children: [
          { label: 'Trip List', url: '/vehicle-out/trip-list' },
          { label: 'Builty List', url: '/vehicle-out/builty-list' },
        ],
      },
      { label: 'Fuel', url: '/fuel', icon: Fuel },
      {
        label: 'Expense Report',
        url: '/expense-report',
        icon: Warehouse,
        children: [
          { label: 'Trip List', url: '/expense-report/trip-expense-report' },
          { label: 'Builty List', url: '/expense-report/builty-expense-report' },
        ],
      },
      {
        label: 'Expense Completed',
        url: '/expense-completed',
        icon: Warehouse,
        children: [
          { label: 'Trip List', url: '/expense-completed/trip-expense-completed' },
          { label: 'Builty List', url: '/expense-completed/builty-expense-completed' },
        ],
      },
      {
        label: 'Account Check',
        url: '/account-check',
        icon: Warehouse,
        children: [
          { label: 'Trip List', url: '/account-check/trip-account-check' },
          { label: 'Builty List', url: '/account-check/builty-account-check' },
        ],
      },
      {
        label: 'Complete',
        url: '/completed',
        icon: Warehouse,
        children: [
          { label: 'Trip List', url: '/completed/trip-completed' },
          { label: 'Builty List', url: '/completed/builty-completed' },
        ],
      },
      { label: 'Bank', url: '/bank', icon: Banknote },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { label: 'Dashboard', url: '/dashboard', icon: Home },
      { label: 'Attendance Officer', url: '/attendance_officer', icon: List },
      { label: 'Odometer Report', url: '/odometer-report', icon: FolderOpenDot },
      { label: 'Visit', url: '/visit/visit', icon: AlignVerticalDistributeEnd },
      { label: 'Shops', url: '/shops', icon: ShoppingBag },
      { label: 'Expense', url: '/expense', icon: Wallet2 },
    ],
  },
  {
    title: 'RATE',
    items: [
      { label: 'Dashboard', url: '/dashboard', icon: Home },
      { label: 'Price Change', url: '/price_change', icon: BadgeIndianRupee },
      { label: 'Sale Close History', url: '/sale_close_history', icon: ClockAlert },
      { label: 'Price Change History', url: '/price_change_history', icon: ClipboardClock },
      { label: 'District Price History', url: '/district_price_history', icon: LandPlot },
      {
        label: 'Bucket',
        url: '/bucket',
        icon: Cylinder,
        children: [
          { label: 'Bucket List', url: '/bucket/bucket_list' },
          { label: 'Pre Order', url: '/bucket/pre_order_list' },
          { label: 'Bucket Request', url: '/bucket/bucket_request' },
        ],
      },
    ],
  },
];

const CATEGORY_DOMAINS: Record<string, string> = {
  MASTER: 'master.mgdh.in',
  'RAW MATERIALS': 'raw.mgdh.in',
  'BANKING & SCROLL': 'scroll.mgdh.in',
  'ORDERS & MANAGEMENT': 'order.mgdh.in',
  LOGISTICS: 'logistic-mds.mgdh.in',
  MARKETING: 'marketing.mgdh.in',
  RATE: 'rate.mgdh.in',
};

export interface CommandPaletteProps {
  navigate?: (path: string) => void;
}

const CommandPalette = ({ navigate }: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const flatDisplayItems = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const result: any[] = [];

    SEARCH_CATEGORIES.forEach((category) => {
      category.items.forEach((item) => {
        const itemMatches = item.label.toLowerCase().includes(lowerQuery);
        const matchedChildren = (item.children || []).filter((child) =>
          child.label.toLowerCase().includes(lowerQuery),
        );

        // If parent matches, or any child matches, we include them
        if (itemMatches || matchedChildren.length > 0) {
          // Add Parent
          result.push({
            id: item.url || item.label,
            label: item.label,
            url: item.url,
            icon: item.icon,
            isChild: false,
            categoryTitle: category.title,
          });

          const childrenToRender = itemMatches ? item.children || [] : matchedChildren;

          childrenToRender.forEach((child) => {
            result.push({
              id: child.url || child.label,
              label: child.label,
              url: child.url,
              icon: Hash, // Hash icon for children, like the screenshot
              isChild: true,
              parentLabel: item.label,
              categoryTitle: category.title,
            });
          });
        }
      });
    });

    return result;
  }, [searchQuery]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest', // Keeps the UI stable and just shifts the scrollbar enough to see the item
      });
    }
  }, [selectedIndex, isOpen]);

  const internalRoute = (path: string) => {
    if (navigate) {
      navigate(path); // Use the provided router to avoid reload
    } else {
      window.location.href = path; // Fallback to native window routing
    }
  };

  const handleSelect = (item: any) => {
    if (!item.url) return;

    setIsOpen(false);
    setSearchQuery('');

    const currentHost = window.location.hostname; // e.g., 'rate.mgdh.in'
    const isCurrentOrder = currentHost === 'mgdh.in' || currentHost === 'order.mgdh.in';

    // 1. Handle explicit absolute URLs (EXTERNAL SERVICES)
    if (item.url.startsWith('http')) {
      const targetUrl = new URL(item.url);
      const targetHost = targetUrl.hostname;
      const isTargetOrder = targetHost === 'mgdh.in' || targetHost === 'order.mgdh.in';

      if (currentHost === targetHost || (isCurrentOrder && isTargetOrder)) {
        internalRoute(targetUrl.pathname + targetUrl.search);
      } else {
        window.open(item.url, '_blank');
      }
      return;
    }

    const targetHost = CATEGORY_DOMAINS[item.categoryTitle] || currentHost;
    const isTargetOrder = targetHost === 'order.mgdh.in' || targetHost === 'mgdh.in';

    if (currentHost === targetHost || (isCurrentOrder && isTargetOrder)) {
      internalRoute(item.url);
    } else {
      const fullUrl = `https://${targetHost}${item.url}`;
      window.open(fullUrl, '_blank');
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % flatDisplayItems.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + flatDisplayItems.length) % flatDisplayItems.length,
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (flatDisplayItems[selectedIndex]) {
            handleSelect(flatDisplayItems[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatDisplayItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Backdrop */}
      <Flex
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="blackAlpha.500"
        backdropFilter="blur(4px)"
        zIndex="9999"
        justifyContent="center"
        alignItems="flex-start"
        pt="10vh"
        onClick={() => setIsOpen(false)}
      >
        {/* Modal Content */}
        <Box
          bg="white"
          w="100%"
          maxW="750px"
          borderRadius="xl"
          boxShadow="2xl"
          overflow="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header / Search Input */}
          <Flex align="center" px={5} py={4} borderBottom="1px solid" borderColor="gray.100">
            <Icon as={Search} color="blue.500" boxSize={5} mr={4} />
            <Input
              variant="subtle"
              placeholder="Search links, components, and orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fontSize="sm"
              autoFocus
              _placeholder={{ color: 'gray.400' }}
            />
            <Kbd
              bg="gray.100"
              borderColor="gray.300"
              color="gray.600"
              fontSize="xs"
              px={2}
              py={1}
              ml={2}
              borderRadius="md"
            >
              esc
            </Kbd>
          </Flex>

          {/* Body / Results */}
          <Box maxH="60vh" overflowY="auto" pb={4}>
            {flatDisplayItems.length === 0 ? (
              <Text textAlign="center" color="gray.500" py={10}>
                No results found for "{searchQuery}"
              </Text>
            ) : (
              <Flex direction="column" gap={1} p={3}>
                {flatDisplayItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const showCategoryHeader =
                    index === 0 || flatDisplayItems[index - 1].categoryTitle !== item.categoryTitle;

                  return (
                    // Attach the Ref here so the scroll calculation knows exactly where this item is
                    <Box
                      key={`${item.id}-${index}`}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                    >
                      {showCategoryHeader && (
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color="gray.500"
                          mt={4}
                          mb={2}
                          px={3}
                          letterSpacing="widest"
                        >
                          {item.categoryTitle}
                        </Text>
                      )}

                      <Flex
                        align="center"
                        justify="space-between"
                        px={4}
                        py={3}
                        ml={item.isChild ? 8 : 0} // Indent children
                        borderRadius="md"
                        cursor="pointer"
                        bg={isSelected ? 'blue.50' : 'transparent'}
                        borderLeft={item.isChild ? '2px solid' : 'none'}
                        borderColor="gray.200"
                        _hover={{ bg: 'blue.50' }}
                        transition="background 0.1s"
                        onClick={() => handleSelect(item)}
                      >
                        <Flex align="center">
                          <Icon
                            as={item.icon}
                            boxSize={item.isChild ? 4 : 5}
                            color={isSelected ? 'blue.600' : 'gray.500'}
                            mr={4}
                          />
                          <Flex direction="column">
                            <Text
                              fontSize="sm"
                              fontWeight={item.isChild ? 'normal' : 'medium'}
                              color={isSelected ? 'blue.700' : 'gray.800'}
                            >
                              {item.label}
                            </Text>
                            {item.isChild && (
                              <Text fontSize="xs" color="gray.500">
                                {item.parentLabel}
                              </Text>
                            )}
                          </Flex>
                        </Flex>

                        {/* Badge for external Links or parent tracking */}
                        {item.url?.startsWith('http') && !item.isChild && (
                          <Text
                            fontSize="xs"
                            bg="gray.100"
                            color="gray.500"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                          >
                            MGDH App
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            )}
          </Box>

          {/* Footer */}
          <Flex
            px={6}
            py={3}
            borderTop="1px solid"
            borderColor="gray.100"
            bg="gray.50"
            justify="space-between"
            align="center"
          >
            <Flex gap={4}>
              <Flex align="center" gap={1}>
                <Kbd fontSize="xs">↑</Kbd>
                <Kbd fontSize="xs">↓</Kbd>
                <Text fontSize="xs" color="gray.500">
                  to navigate
                </Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Kbd fontSize="xs">enter</Kbd>
                <Text fontSize="xs" color="gray.500">
                  to open
                </Text>
              </Flex>
            </Flex>
            <Flex align="center" color="blue.600" fontWeight="bold" fontSize="sm">
              <Icon as={Search} boxSize={3} mr={1} /> MDS Search
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Portal>
  );
};

export default CommandPalette;
