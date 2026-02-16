import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#FF80AB', '#4FC3F7', '#81C784', '#FFD54F', '#BA68C8', '#FF8A65'];

export const RevenueChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300, minHeight: 300, marginTop: '20px' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#666' }}>Revenue Trend</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `Ksh ${value >= 1000 ? value / 1000 + 'k' : value}`} />
                    <Tooltip
                        formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#FF80AB"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#FF80AB' }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export const OrderVolumeChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300, minHeight: 300, marginTop: '20px' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#666' }}>Order Volume</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="orders" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const StatusPieChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 250, minHeight: 250 }}>
            <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#666' }}>OrderStatus Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
