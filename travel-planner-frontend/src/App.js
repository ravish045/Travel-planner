import React from 'react';

// --- Helper Components ---
const IconInput = ({ icon, ...props }) => (
  <div className="relative">
    <i className={`fas ${icon} absolute left-4 top-1/2 -translate-y-1/2 text-gray-400`}></i>
    <input
      {...props}
      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

// --- Hero Section ---
const HeroSection = () => (
  <header
    className="hero-section h-screen flex flex-col justify-center items-center text-white text-center p-4"
    style={{
      backgroundImage:
        "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg animate-fade-in-down">
      Plan Your Next Adventure
    </h1>
    <p
      className="text-lg md:text-xl mt-4 max-w-2xl drop-shadow-md animate-fade-in-up"
      style={{ animationDelay: '0.2s' }}
    >
      AI-powered itineraries, packing lists, and hotel suggestions in seconds.
    </p>
    <a
      href="#planner-section"
      className="mt-8 bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
      style={{ animationDelay: '0.4s' }}
    >
      Start Planning
    </a>
    <div className="absolute bottom-10 animate-bounce">
      <a href="#planner-section">
        <i className="fas fa-chevron-down text-3xl"></i>
      </a>
    </div>
  </header>
);

// --- Planner Form ---
const PlannerForm = ({ onGenerate, loading }) => {
  const [destination, setDestination] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!destination || !startDate || !endDate) {
      setError('Please fill out all fields.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before the start date.');
      return;
    }

    onGenerate({ destination, startDate, endDate });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl mb-8 transform hover:-translate-y-2 transition-transform duration-300" id="planner-section">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Let's Get Started!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <IconInput
              icon="fa-map-marker-alt"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Paris, France"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <IconInput icon="fa-calendar-alt" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <IconInput icon="fa-calendar-alt" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate My Plan'}
            {loading && <div className="w-6 h-6 border-4 border-gray-200 border-t-white rounded-full animate-spin ml-3"></div>}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Output Display ---
const OutputDisplay = ({ plan }) => {
  if (!plan) return null;



  return (
    <div className="space-y-8 animate-fade-in">
      {/* Checklists, Itinerary, Accommodation code here (same as before) */}
      {/* You can reuse your current OutputDisplay structure */}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [plan, setPlan] = React.useState(null);

  const handleGeneratePlan = async ({ destination, startDate, endDate }) => {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${backendUrl}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, startDate, endDate }),
      });

      if (!response.ok) throw new Error(`Backend error: ${response.statusText}`);

      const data = await response.json();
      setPlan(data.plan);
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err.message || 'Failed to generate the travel plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      <HeroSection />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 -mt-32 relative z-10">
        <main>
          <PlannerForm onGenerate={handleGeneratePlan} loading={loading} />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              {error}
            </div>
          )}
          <OutputDisplay plan={plan} />
        </main>
      </div>
    </div>
  );
}
