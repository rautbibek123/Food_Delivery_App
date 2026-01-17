import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import api from '../services/api';

jest.mock('../services/api');
jest.mock('recharts', () => ({
    BarChart: () => <div>BarChart</div>,
    Bar: () => <div>Bar</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    CartesianGrid: () => <div>CartesianGrid</div>,
    Tooltip: () => <div>Tooltip</div>,
    ResponsiveContainer: ({ children }) => <div>{children}</div>
}));
jest.mock('lucide-react', () => ({
    LayoutDashboard: () => <div>LayoutDashboard</div>,
    Package: () => <div>Package</div>,
    ShoppingBag: () => <div>ShoppingBag</div>,
    Plus: () => <div>Plus</div>,
    Trash2: () => <div>Trash2</div>,
    TrendingUp: () => <div>TrendingUp</div>,
    DollarSign: () => <div>DollarSign</div>,
    Users: () => <div>Users</div>,
    Edit2: () => <div>Edit2</div>,
    CheckCircle: () => <div>CheckCircle</div>,
    XCircle: () => <div>XCircle</div>,
    X: () => <div>X</div>,
    Save: () => <div>Save</div>,
    Store: () => <div>Store</div>,
    Tag: () => <div>Tag</div>,
    Search: () => <div>Search</div>,
    Filter: () => <div>Filter</div>,
    Calendar: () => <div>Calendar</div>,
    Upload: () => <div>Upload</div>
}));

describe('Product Edit Validation', () => {
    const mockData = {
        products: [{ _id: 'p1', name: 'Momo', price: 120, restaurantId: 'r1', description: 'Test', image: 'img.jpg', categories: ['Nepali'], tags: ['popular'], cuisine: 'Nepali' }],
        restaurants: [{ _id: 'u1', restaurantDocId: 'r1', restaurantDetails: { restaurantName: 'Nepal Kitchen' } }],
        orders: [], users: [], stats: [], coupons: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        api.get.mockImplementation((url) => {
            const map = {
                '/products': mockData.products, '/admin/orders': mockData.orders, '/admin/users': mockData.users,
                '/admin/stats': mockData.stats, '/admin/restaurants': mockData.restaurants, '/coupons/all': mockData.coupons
            };
            return Promise.resolve({ data: map[url] || [] });
        });
        global.alert = jest.fn();
        global.confirm = jest.fn(() => true);
    });

    const openEdit = async () => {
        const { container } = render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
        await waitFor(() => expect(screen.queryByText('Loading Dashboard...')).not.toBeInTheDocument());
        fireEvent.click(screen.getByText('Products'));
        fireEvent.click(container.querySelectorAll('button[class*="text-blue-500"]')[0]);
        await waitFor(() => expect(screen.getByText('Edit Product')).toBeInTheDocument());
    };

    test('PASS - Valid name and price', async () => {
        await openEdit();
        fireEvent.change(screen.getByDisplayValue('Momo'), { target: { value: 'Sel Roti' } });
        fireEvent.change(screen.getByDisplayValue('120'), { target: { value: '80' } });
        api.put.mockResolvedValue({ data: mockData.products[0] });
        fireEvent.click(screen.getByText('Update Product'));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith('/admin/products/p1', expect.objectContaining({ name: 'Sel Roti', price: 80 })));
        expect(global.alert).toHaveBeenCalledWith('Product Updated!');
    });

    test('PASS - Empty name and price blocked by validation', async () => {
        await openEdit();
        fireEvent.change(screen.getByDisplayValue('Momo'), { target: { value: '' } });
        fireEvent.change(screen.getByDisplayValue('120'), { target: { value: '' } });
        fireEvent.click(screen.getByText('Update Product'));
        await waitFor(() => expect(api.put).not.toHaveBeenCalled(), { timeout: 1000 });
    });

    test('FAIL - Negative price should be rejected but is accepted', async () => {
        await openEdit();
        fireEvent.change(screen.getByDisplayValue('Momo'), { target: { value: 'Thuppa' } });
        fireEvent.change(screen.getByDisplayValue('120'), { target: { value: '-100' } });
        api.put.mockResolvedValue({ data: mockData.products[0] });
        fireEvent.click(screen.getByText('Update Product'));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith('/admin/products/p1', expect.objectContaining({ price: -100 })));
        // This test will FAIL because negative price should be rejected but system accepts it
        expect(api.put).not.toHaveBeenCalled(); // Expected: not called, Actual: called
    });

    test('FAIL - (Special characters)invalid name and valid priceshould be rejected but are accepted', async () => {
        await openEdit();
        fireEvent.change(screen.getByDisplayValue('Momo'), { target: { value: '@@@' } });
        fireEvent.change(screen.getByDisplayValue('120'), { target: { value: '150' } });
        api.put.mockResolvedValue({ data: mockData.products[0] });
        fireEvent.click(screen.getByText('Update Product'));
        await waitFor(() => expect(api.put).toHaveBeenCalledWith('/admin/products/p1', expect.objectContaining({ name: '@@@' })));
        // This test will FAIL because special characters should be rejected but system accepts them
        expect(api.put).not.toHaveBeenCalled(); // Expected: not called, Actual: called
    });
});
