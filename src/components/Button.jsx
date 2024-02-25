/* eslint-disable react/prop-types */
export default function Button({ props, children }) {
  return (
    <button
      className="px-4 py-1.5 bg-black text-white rounded-md text-sm hover:bg-black/90"
      {...props}
    >
      {children}
    </button>
  );
}
