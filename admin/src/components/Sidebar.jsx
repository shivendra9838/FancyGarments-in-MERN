import React from 'react';
import { NavLink } from 'react-router-dom';
import { add_icon, order_icon } from '../assets/assets';

const Sidebar = () => {
    return (
        <div className="w-[200px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
            <div className="flex flex-col gap-4 pt-6 pl-4 pr-2">
                <NavLink
                    to="/add"
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 border-r-0 px-3 py-2 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <img className="w-4 h-4 ml-0.5" src={add_icon} alt="Add" />
                    <p className="md:block text-sm font-medium text-black dark:text-gray-200 ml-3">Add Items</p>
                </NavLink>

                <NavLink
                    to="/list"
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 border-r-0 px-3 py-2 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <img className="w-4 h-4 ml-0.5" src={order_icon} alt="List" />
                    <p className="md:block text-sm font-medium text-black dark:text-gray-200 ml-3">List Items</p>
                </NavLink>

                <NavLink
                    to="/orders"
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 border-r-0 px-3 py-2 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <img className="w-4 h-4 ml-0.5" src={order_icon} alt="Orders" />
                    <p className="md:block text-sm font-medium text-black dark:text-gray-200 ml-3">Orders</p>
                </NavLink>
                <NavLink
                    to="/wishlist"
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 border-r-0 px-3 py-2 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <img className="w-4 h-4 ml-0.5" src={order_icon} alt="Wishlist" />
                    <p className="md:block text-sm font-medium text-black dark:text-gray-200 ml-3">Wishlist</p>
                </NavLink>
                <NavLink
                    to="/users"
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 border-r-0 px-3 py-2 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <img className="w-4 h-4 ml-0.5" src={order_icon} alt="Users" />
                    <p className="md:block text-sm font-medium text-black dark:text-gray-200 ml-3">Users</p>
                </NavLink>
                <NavLink
                    to="/profile"
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 border-r-0 px-3 py-2 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <img className="w-4 h-4 ml-0.5" src={order_icon} alt="Profile" />
                    <p className="md:block text-sm font-medium text-black dark:text-gray-200 ml-3">Profile</p>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
