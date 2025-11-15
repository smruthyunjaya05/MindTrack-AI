"""API blueprint: timeline endpoints (Phase 1 starter).

Provides an in-memory timeline store for development. This will be
replaced with PostgreSQL persistence in Phase 5.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta

timeline_bp = Blueprint('timeline', __name__)

# In-memory list to hold analyses during initial development.
# Each entry is a dict similar to analysis response.
_IN_MEMORY_STORE = []


@timeline_bp.route('/timeline', methods=['GET'])
def get_timeline():
    days = request.args.get('days', default=30, type=int)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    results = [e for e in _IN_MEMORY_STORE if start_date <= datetime.fromisoformat(e['timestamp']) <= end_date]
    return jsonify({'count': len(results), 'date_range': {'start': start_date.isoformat(), 'end': end_date.isoformat()}, 'analyses': results}), 200


@timeline_bp.route('/stats', methods=['GET'])
def get_stats():
    total = len(_IN_MEMORY_STORE)
    distribution = {'Normal': 0, 'Stressed/Depressed': 0}
    for e in _IN_MEMORY_STORE:
        lbl = e.get('prediction', {}).get('emotion_class', 'Normal')
        distribution[lbl] = distribution.get(lbl, 0) + 1

    # convert to percentages
    dist_pct = {}
    for k, v in distribution.items():
        pct = round((v / total) * 100, 2) if total > 0 else 0.0
        dist_pct[k] = {'count': v, 'percentage': pct}

    return jsonify({'total_analyses': total, 'distribution': dist_pct}), 200


@timeline_bp.route('/clear', methods=['DELETE'])
def clear_history():
    count = len(_IN_MEMORY_STORE)
    _IN_MEMORY_STORE.clear()
    return jsonify({'message': f'Deleted {count} entries', 'deleted_count': count}), 200


@timeline_bp.route('/_internal/add', methods=['POST'])
def _add_entry():
    """Internal helper used during Phase 1 to add entries to in-memory store."""
    data = request.get_json(silent=True) or {}
    # basic validation
    if 'timestamp' not in data:
        data['timestamp'] = datetime.utcnow().isoformat()
    _IN_MEMORY_STORE.append(data)
    return jsonify({'ok': True, 'total': len(_IN_MEMORY_STORE)}), 201
