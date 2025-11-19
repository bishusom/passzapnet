const FallbackTool = () => {
  return (
    <div className="text-center py-12">
      <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tool Temporarily Unavailable</h2>
      <p className="text-gray-600">
        This tool is currently being updated. Please check back later.
      </p>
    </div>
  );
};

export default FallbackTool;