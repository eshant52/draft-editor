/* eslint-disable react/prop-types */
export default function Button({ children, name, ...props }) {
  console.log(name);

  return (
    <button
      className="px-4 py-1.5 bg-black text-white rounded-md text-sm disabled:bg-black/50 hover:bg-black/90 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
}
