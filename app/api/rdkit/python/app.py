"""
RDKit API Service
A microservice that provides RDKit functionality via a REST API
"""

from flask import Flask, request, jsonify, Response
import json
import os
import io
import base64
from rdkit import Chem
from rdkit.Chem import AllChem, Draw, Descriptors, Crippen, rdMolDescriptors
from rdkit.Chem.Draw import rdMolDraw2D
from flask_cors import CORS
import rdkit
from werkzeug.exceptions import BadRequest
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the front-end

# Settings
PORT = int(os.environ.get("PORT", 5000))  # Default port 5000
DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    return """
    <html>
      <head>
        <title>RDKit API Service</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; }
          .test-area { margin: 20px 0; }
          input { padding: 8px; width: 300px; }
          button { padding: 8px 16px; background: #4CAF50; color: white; border: none; cursor: pointer; }
          #result { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>RDKit API Service</h1>
        <p>This is a RDKit API service for molecular visualization and property prediction.</p>
        
        <div class="test-area">
          <h2>Test Molecule Visualization</h2>
          <input type="text" id="smiles" placeholder="Enter SMILES (e.g., CCO for ethanol)" value="CCO">
          <button onclick="visualize()">Visualize</button>
          <div id="result"></div>
        </div>
        
        <script>
          function visualize() {
            const smiles = document.getElementById('smiles').value;
            if (!smiles) return;
            
            const url = `/api/rdkit/visualize?smiles=${encodeURIComponent(smiles)}&width=400&height=300`;
            fetch(url)
              .then(response => response.text())
              .then(svg => {
                document.getElementById('result').innerHTML = svg;
              })
              .catch(error => {
                document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
              });
          }
          
          // Visualize on page load
          visualize();
        </script>
      </body>
    </html>
    """

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "rdkit_version": rdkit.__version__
    })

@app.route('/depict', methods=['GET'])
def depict_molecule():
    try:
        smiles = request.args.get('smiles')
        if not smiles:
            return jsonify({"error": "No SMILES provided"}), 400

        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return jsonify({"error": "Invalid SMILES string"}), 400

        img = Draw.MolToImage(mol)
        
        # Convert PIL Image to bytes
        img_io = io.BytesIO()
        img.save(img_io, 'PNG')
        img_io.seek(0)
        
        return Response(
            img_io.getvalue(),
            mimetype='image/png'
        )
    except Exception as e:
        logger.error(f"Error in depict_molecule: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/visualize', methods=['GET'])
def visualize_molecule():
    try:
        smiles = request.args.get('smiles')
        if not smiles:
            return jsonify({"error": "No SMILES provided"}), 400

        # Parse additional visualization parameters
        width = int(request.args.get('width', 400))
        height = int(request.args.get('height', 300))
        add_stereo = request.args.get('addStereoAnnotation', 'true').lower() == 'true'
        bond_line_width = float(request.args.get('bondLineWidth', 2.0))
        add_atom_indices = request.args.get('addAtomIndices', 'false').lower() == 'true'
        add_bond_indices = request.args.get('addBondIndices', 'false').lower() == 'true'
        highlightAtoms = request.args.get('highlightAtoms')
        kekulize = request.args.get('kekulize', 'true').lower() == 'true'
        
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return jsonify({"error": "Invalid SMILES string"}), 400

        # Prepare molecule for drawing
        AllChem.Compute2DCoords(mol)
        
        # Create drawer with improved options
        drawer = rdMolDraw2D.MolDraw2DSVG(width, height)
        drawer.SetFontSize(0.8)  # Relative font size
        
        # Configure drawing options
        opts = drawer.drawOptions()
        opts.addStereoAnnotation = add_stereo
        opts.bondLineWidth = bond_line_width
        opts.addAtomIndices = add_atom_indices
        opts.addBondIndices = add_bond_indices
        
        # Set up atom highlighting if specified
        highlights = []
        if highlightAtoms:
            try:
                highlights = [int(idx) for idx in highlightAtoms.split(',')]
            except (ValueError, AttributeError):
                pass
        
        # Draw the molecule
        if highlights:
            drawer.DrawMolecule(mol, highlightAtoms=highlights)
        else:
            drawer.DrawMolecule(mol)
        
        drawer.FinishDrawing()
        svg = drawer.GetDrawingText()
        
        return Response(
            svg,
            mimetype='image/svg+xml'
        )
    except Exception as e:
        logger.error(f"Error in visualize_molecule: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/properties', methods=['POST'])
def predict_properties():
    try:
        data = request.json
        if not data or 'smiles' not in data:
            return jsonify({"error": "No SMILES provided"}), 400

        smiles = data['smiles']
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return jsonify({"error": "Invalid SMILES string"}), 400

        # Calculate properties
        properties = {
            'molecular_weight': Descriptors.MolWt(mol),
            'logp': Descriptors.MolLogP(mol),
            'num_h_donors': Descriptors.NumHDonors(mol),
            'num_h_acceptors': Descriptors.NumHAcceptors(mol),
            'num_rotatable_bonds': Descriptors.NumRotatableBonds(mol),
            'topological_polar_surface_area': Descriptors.TPSA(mol),
            'num_heavy_atoms': mol.GetNumHeavyAtoms(),
            'formula': Chem.rdMolDescriptors.CalcMolFormula(mol)
        }

        return jsonify(properties)
    except Exception as e:
        logger.error(f"Error in predict_properties: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/optimize', methods=['POST'])
def optimize_molecule():
    try:
        data = request.json
        if not data or 'smiles' not in data:
            return jsonify({"error": "No SMILES provided"}), 400

        # In a real application, this would interface with optimization algorithms
        # For now, we'll return the original molecule with a message
        return jsonify({
            "original_smiles": data['smiles'],
            "optimized_smiles": data['smiles'],  # Placeholder
            "message": "Molecule optimization simulation (no actual changes made)"
        })
    except Exception as e:
        logger.error(f"Error in optimize_molecule: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/modify', methods=['POST'])
def modify_molecule():
    try:
        data = request.json
        if not data or 'smiles' not in data or 'modification_type' not in data:
            return jsonify({"error": "SMILES and modification_type are required"}), 400

        smiles = data['smiles']
        modification_type = data['modification_type']

        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return jsonify({"error": "Invalid SMILES string"}), 400

        # For demonstration purposes:
        # This would be replaced with actual chemical modifications
        # based on the modification_type
        modified_mol = mol  # Placeholder, no actual modification
        
        return jsonify({
            "original_smiles": smiles,
            "modified_smiles": Chem.MolToSmiles(modified_mol),
            "modification_type": modification_type,
            "message": f"Simulated {modification_type} modification (no actual changes made)"
        })
    except Exception as e:
        logger.error(f"Error in modify_molecule: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info(f"Starting RDKit service with RDKit version {rdkit.__version__}")
    app.run(host='0.0.0.0', port=PORT, debug=DEBUG) 