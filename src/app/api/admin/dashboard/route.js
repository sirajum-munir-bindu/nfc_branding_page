import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { formatOrder } from '@/app/api/orders/route';

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const totalOrders = await prisma.order.count();

    const ordersNonCancelled = await prisma.order.findMany({
      where: {
        status: { not: 'Cancelled' },
      },
      select: { totalAmount: true },
    });
    const totalRevenue = ordersNonCancelled.reduce(
      (sum, o) => sum + (o.totalAmount ? Number(o.totalAmount) : 0),
      0
    );

    const totalCustomers = await prisma.customerProfile.count();
    const activeProducts = await prisma.product.count({ where: { isActive: true } });
    const pendingOrders = await prisma.order.count({ where: { status: 'Pending' } });
    const unreadMessages = await prisma.contactMessage.count({ where: { isRead: false } });

    // Last 7 days sales chart
    const salesChart = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        select: { status: true, totalAmount: true },
      });

      const dayRev = dayOrders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.totalAmount ? Number(o.totalAmount) : 0), 0);

      salesChart.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        revenue: Math.round(dayRev * 100) / 100,
        orders: dayOrders.length,
      });
    }

    // Status breakdown
    const allOrders = await prisma.order.findMany({
      select: { status: true },
    });
    const statusBreakdown = {};
    for (const ord of allOrders) {
      statusBreakdown[ord.status] = (statusBreakdown[ord.status] || 0) + 1;
    }

    // Popular products
    const orderItems = await prisma.orderItem.findMany({
      select: {
        productName: true,
        quantity: true,
        unitPrice: true,
      },
    });

    const productMap = {};
    for (const item of orderItems) {
      const pName = item.productName || 'Unknown';
      if (!productMap[pName]) {
        productMap[pName] = { sales_count: 0, total_sales: 0 };
      }
      productMap[pName].sales_count += item.quantity || 1;
      productMap[pName].total_sales +=
        (item.quantity || 1) * (item.unitPrice ? Number(item.unitPrice) : 0);
    }

    const popularProducts = Object.entries(productMap)
      .map(([name, data]) => ({
        product_name: name,
        sales_count: data.sales_count,
        total_sales: Math.round(data.total_sales * 100) / 100,
      }))
      .sort((a, b) => b.sales_count - a.sales_count)
      .slice(0, 5);

    // Recent 5 orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return NextResponse.json({
      overview: {
        total_orders: totalOrders,
        total_revenue: Math.round(totalRevenue * 100) / 100,
        total_customers: totalCustomers,
        active_products: activeProducts,
        pending_orders: pendingOrders,
        unread_messages: unreadMessages,
      },
      sales_chart: salesChart,
      status_breakdown: statusBreakdown,
      popular_products: popularProducts,
      recent_orders: recentOrders.map(formatOrder),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
