"""
Convert XGBoost diabetes model to ONNX format for mobile deployment.

Requirements:
- onnxmltools
- skl2onnx
- onnxruntime (for validation)

Run: python scripts/convert_model_to_onnx.py
"""

import joblib
import numpy as np
from pathlib import Path
import json

def convert_to_onnx():
    """Convert XGBoost model to ONNX format."""
    
    print("🔄 Converting XGBoost model to ONNX...")
    
    # Load the trained model
    model_path = Path(__file__).parent.parent / "models" / "diabetes_model.joblib"
    metadata_path = Path(__file__).parent.parent / "models" / "model_metadata.json"
    
    print(f"📂 Loading model from: {model_path}")
    model = joblib.load(model_path)
    
    # Load metadata
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    
    print(f"✅ Model loaded: {metadata['model_type']} v{metadata['xgboost_version']}")
    print(f"📊 Accuracy: {metadata['accuracy']:.2%}")
    print(f"🔢 Features: {len(metadata['feature_names'])}")
    
    # Determine if it's a pipeline or raw XGBoost
    if hasattr(model, 'named_steps'):
        # It's a Pipeline
        print("🔧 Detected sklearn Pipeline")
        from skl2onnx import to_onnx
        from skl2onnx.common.data_types import FloatTensorType
        
        # Define input shape (21 features)
        n_features = len(metadata['feature_names'])
        initial_type = [('float_input', FloatTensorType([None, n_features]))]
        
        # Convert entire pipeline
        onnx_model = to_onnx(
            model,
            initial_types=initial_type,
            target_opset=15,  # Compatible with mobile ONNX Runtime
            options={'zipmap': False}  # Simpler output format
        )
        
    else:
        # Raw XGBoost model
        print("🔧 Detected raw XGBoost model")
        from onnxmltools.convert import convert_xgboost
        from onnxmltools.convert.common.data_types import FloatTensorType
        
        # Define input shape
        n_features = len(metadata['feature_names'])
        initial_type = [('float_input', FloatTensorType([None, n_features]))]
        
        # Convert XGBoost to ONNX
        onnx_model = convert_xgboost(
            model,
            initial_types=initial_type,
            target_opset=15
        )
    
    # Save ONNX model
    output_path = Path(__file__).parent.parent / "mobile" / "assets" / "models" / "diabetes_model.onnx"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, "wb") as f:
        f.write(onnx_model.SerializeToString())
    
    model_size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ ONNX model saved: {output_path}")
    print(f"📦 Model size: {model_size_mb:.2f} MB")
    
    # Validate the ONNX model
    print("\n🔍 Validating ONNX model...")
    validate_onnx_model(output_path, metadata['feature_names'])
    
    # Create optimized/quantized versions
    print("\n⚡ Creating optimized versions...")
    create_optimized_models(output_path)
    
    print("\n✅ Conversion complete!")
    print(f"📱 Mobile model ready at: {output_path}")

def validate_onnx_model(onnx_path, feature_names):
    """Validate ONNX model with test input."""
    import onnxruntime as ort
    
    # Load ONNX model
    session = ort.InferenceSession(str(onnx_path))
    
    # Create test input (average values)
    test_input = np.array([[
        1.0,  # HighBP
        1.0,  # HighChol
        20.0, # BMI (example)
        0.0,  # Smoker
        0.0,  # Stroke
        0.0,  # HeartDiseaseorAttack
        1.0,  # PhysActivity
        1.0,  # Fruits
        1.0,  # Veggies
        0.0,  # HvyAlcoholConsump
        1.0,  # AnyHealthcare
        0.0,  # NoDocbcCost
        1.0,  # GenHlth
        5.0,  # MentHlth
        5.0,  # PhysHlth
        0.0,  # DiffWalk
        1.0,  # Sex
        5.0,  # Age
        4.0,  # Education
        5.0,  # Income
        25.0  # BMI_Age_Interaction
    ]], dtype=np.float32)
    
    # Run inference
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    
    result = session.run([output_name], {input_name: test_input})
    
    print(f"✅ ONNX validation passed!")
    print(f"   Input shape: {test_input.shape}")
    print(f"   Output: {result[0]}")
    print(f"   Prediction: {'Diabetes Risk' if result[0][0] > 0.5 else 'Low Risk'}")

def create_optimized_models(onnx_path):
    """Create FP16 and INT8 quantized versions."""
    try:
        from onnxruntime.quantization import quantize_dynamic, QuantType
        
        # FP16 quantization (2x smaller, faster on mobile GPUs)
        fp16_path = onnx_path.parent / "diabetes_model_fp16.onnx"
        quantize_dynamic(
            str(onnx_path),
            str(fp16_path),
            weight_type=QuantType.QUInt8
        )
        
        fp16_size_mb = fp16_path.stat().st_size / (1024 * 1024)
        print(f"✅ FP16 model: {fp16_path} ({fp16_size_mb:.2f} MB)")
        
        # INT8 quantization (4x smaller, fastest on CPUs)
        int8_path = onnx_path.parent / "diabetes_model_int8.onnx"
        quantize_dynamic(
            str(onnx_path),
            str(int8_path),
            weight_type=QuantType.QInt8
        )
        
        int8_size_mb = int8_path.stat().st_size / (1024 * 1024)
        print(f"✅ INT8 model: {int8_path} ({int8_size_mb:.2f} MB)")
        
    except ImportError:
        print("⚠️  onnxruntime not installed, skipping quantization")
        print("   Install: pip install onnxruntime")

if __name__ == "__main__":
    # Install required packages
    print("📦 Required packages:")
    print("   pip install onnxmltools skl2onnx onnxruntime")
    print()
    
    try:
        import onnxmltools
        import skl2onnx
        import onnxruntime
        
        convert_to_onnx()
        
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("\n📦 Install required packages:")
        print("   pip install onnxmltools skl2onnx onnxruntime")
        exit(1)
