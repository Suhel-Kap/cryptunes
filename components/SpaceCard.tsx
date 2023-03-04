import Link from "next/link";

export default function SpaceCard() {
    return (
        <div className="card card-image-cover">
            <img src="https://source.unsplash.com/random/300x200" alt=""/>
            <div className="card-body">
                <h2 className="card-header">Maximizing Your Productivity at Work</h2>
                <p className="text-content2">Are you looking to increase your productivity at work?</p>
                <div className="card-footer">
                    <Link href="/space">
                        <button className="btn-secondary btn">Learn More</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}