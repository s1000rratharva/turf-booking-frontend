import React from 'react'

const Cards = () => {
  return (
   <section className="bg-white py-16 px-4">
  <h2 className="text-3xl font-bold text-center text-green-700 mb-10">What Players Say</h2>
  <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
    {/* Review Card 1 */}
    <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition">
      <div className="flex items-center space-x-4 mb-4">
        <img src="/avatar1.png" alt="User" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-green-700">Rahul Mehta</h4>
          <p className="text-sm text-gray-500">Cricket Enthusiast</p>
        </div>
      </div>
      <p className="text-gray-600">“Super smooth booking experience! Turf was clean and well-lit. Will book again with my group next weekend.”</p>
    </div>

    {/* Review Card 2 */}
    <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition">
      <div className="flex items-center space-x-4 mb-4">
        <img src="/avatar2.png" alt="User" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-green-700">Neha Sharma</h4>
          <p className="text-sm text-gray-500">Football Captain</p>
        </div>
      </div>
      <p className="text-gray-600">“Loved how fast I could reserve a slot. Got email confirmation instantly and no hassle on arrival.”</p>
    </div>

    {/* Review Card 3 */}
    <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition">
      <div className="flex items-center space-x-4 mb-4">
        <img src="/avatar3.png" alt="User" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-green-700">Aarav Kulkarni</h4>
          <p className="text-sm text-gray-500">Student & Futsal Fan</p>
        </div>
      </div>
      <p className="text-gray-600">“Great value! Friendly staff and easy booking. Turf quality was excellent — highly recommend JES Turf.”</p>
    </div>
  </div>
</section>
  )
}

export default Cards
