import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MessageSquare, Check, X } from 'lucide-react';
import api from '../../utils/api';

type Feedback = {
  id: string;
  customerId: string;
  customerName: string;
  message: string;
  rating: number | null;
  date: Date;
  restaurantId: string;
  restaurantName: string;
  status: 'new' | 'resolved' | 'flagged';
  response?: string;
};

const FeedbackManagement: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'resolved' | 'flagged'>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState('');
  
  useEffect(() => {
    document.title = 'Feedback Management | TastyGo Admin';
    api.get('/api/feedback')
      .then((res: any) => setFeedback(res.data))
      .catch((err: any) => console.error('Failed to fetch feedback', err));
  }, []);
  
  useEffect(() => {
    // Filter feedback based on search term and status filter
    let result = [...feedback];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    setFilteredFeedback(result);
  }, [feedback, searchTerm, statusFilter]);
  
  const handleStatusChange = async (id: string, status: 'new' | 'resolved' | 'flagged', response?: string) => {
    try {
      await api.put(`/api/feedback/${id}`, { status, response });
      setFeedback(feedback.map(item =>
        item.id === id ? { ...item, status, response } : item
      ));
      if (selectedFeedback?.id === id) {
        setSelectedFeedback({ ...selectedFeedback, status, response });
      }
    } catch (error) {
      console.error('Failed to update feedback', error);
    }
  };
  
  const renderStars = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-500 text-sm">No rating</span>;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Feedback & Support Management</h1>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="md:w-1/2">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="Search feedback by customer, content, or restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <label htmlFor="status-filter" className="mr-2 text-sm text-gray-600">Filter by status:</label>
          <select
            id="status-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Feedback</option>
            <option value="new">New</option>
            <option value="resolved">Resolved</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Customer Feedback</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedback.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${selectedFeedback?.id === item.id ? 'bg-orange-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                      <div className="text-sm text-gray-500">{item.date.toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{item.message}</div>
                      <div className="mt-1">{renderStars(item.rating)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.restaurantName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        item.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                        item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredFeedback.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No feedback found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="md:col-span-1">
          {selectedFeedback ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Feedback Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">From</h3>
                        <p className="text-sm font-medium text-gray-900">{selectedFeedback.customerName}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        selectedFeedback.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                        selectedFeedback.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedFeedback.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFeedback.date.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Restaurant</h3>
                    <p className="text-sm font-medium text-gray-900">{selectedFeedback.restaurantName}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                      {renderStars(selectedFeedback.rating)}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Message</h3>
                    <div className="mt-1 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-900">{selectedFeedback.message}</p>
                    </div>
                  </div>
                  
                  {selectedFeedback.response && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Response</h3>
                      <div className="mt-1 bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900">{selectedFeedback.response}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedFeedback.status !== 'resolved' && (
                    <div>
                      <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                        Your Response
                      </label>
                      <textarea
                        id="response"
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Type your response here..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      ></textarea>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    {selectedFeedback.status !== 'resolved' ? (
                      <button
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => {
                          handleStatusChange(selectedFeedback.id, 'resolved', responseText || undefined);
                          setResponseText('');
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark as Resolved
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => handleStatusChange(selectedFeedback.id, 'new')}
                      >
                        <span className="h-4 w-4 mr-1">↻</span>
                        Reopen
                      </button>
                    )}
                    
                    {selectedFeedback.status !== 'flagged' ? (
                      <button
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        onClick={() => handleStatusChange(selectedFeedback.id, 'flagged')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        Flag for Review
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        onClick={() => handleStatusChange(selectedFeedback.id, 'new')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove Flag
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-500 text-sm font-medium">Select feedback to view details</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;